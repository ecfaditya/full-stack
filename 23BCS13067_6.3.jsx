package com.example.moneytransfer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@SpringBootApplication
public class MoneyTransferApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoneyTransferApplication.class, args);
    }

    // ----------- Account Model -----------
    @Document(collection = "accounts")
    public static class Account {
        @Id
        private String id;
        private String owner;
        private double balance;

        public Account() {}
        public Account(String owner, double balance) {
            this.owner = owner;
            this.balance = balance;
        }

        public String getId() { return id; }
        public String getOwner() { return owner; }
        public double getBalance() { return balance; }
        public void setBalance(double balance) { this.balance = balance; }
    }

    // ----------- Repository -----------
    public interface AccountRepository extends MongoRepository<Account, String> {
        Optional<Account> findByOwner(String owner);
    }

    // ----------- Transfer Service -----------
    @Service
    public static class TransferService {

        @Autowired
        private AccountRepository accountRepository;

        public String transfer(String fromOwner, String toOwner, double amount) {
            // Fetch accounts
            Account from = accountRepository.findByOwner(fromOwner)
                    .orElseThrow(() -> new RuntimeException("Sender not found"));
            Account to = accountRepository.findByOwner(toOwner)
                    .orElseThrow(() -> new RuntimeException("Receiver not found"));

            // Validate balance
            if (from.getBalance() < amount) {
                return "Insufficient funds";
            }

            // Perform updates carefully
            try {
                from.setBalance(from.getBalance() - amount);
                accountRepository.save(from); // Update sender first

                to.setBalance(to.getBalance() + amount);
                accountRepository.save(to);   // Update receiver next
            } catch (Exception e) {
                return "Transfer failed: " + e.getMessage();
            }

            return "Transfer successful: " + amount + " from " + fromOwner + " to " + toOwner;
        }
    }

    // ----------- Controller -----------
    @RestController
    @RequestMapping("/api")
    public static class TransferController {

        @Autowired
        private TransferService transferService;

        @PostMapping("/transfer")
        public String transferMoney(@RequestParam String from,
                                    @RequestParam String to,
                                    @RequestParam double amount) {
            return transferService.transfer(from, to, amount);
        }

        @GetMapping("/balance")
        public String getBalance(@RequestParam String owner, @Autowired AccountRepository accountRepository) {
            Account account = accountRepository.findByOwner(owner)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            return owner + " balance: $" + account.getBalance();
        }
    }
}
