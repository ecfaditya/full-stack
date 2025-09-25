// Person base class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  displayInfo() {
    console.log(`Name: ${this.name}, Age: ${this.age}`);
  }
}

// Student subclass
class Student extends Person {
  constructor(name, age, course) {
    super(name, age);
    this.course = course;
  }

  displayInfo() {
    console.log(
      `Name: ${this.name}, Age: ${this.age}, Course: ${this.course}`
    );
  }
}

// Teacher subclass
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  displayInfo() {
    console.log(
      `Name: ${this.name}, Age: ${this.age}, Subject: ${this.subject}`
    );
  }
}

// Create instances
const student1 = new Student("Alice", 20, "Computer Science");
const teacher1 = new Teacher("Mr. John", 45, "Mathematics");

// Demonstrate method calls
student1.displayInfo();
teacher1.displayInfo();
