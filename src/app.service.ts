import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity';
import { Repository } from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { Task } from './task-entity';
import { Meeting } from './meeting.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private contactInfoRepo: Repository<ContactInfo>,
    @InjectRepository(Meeting) private meetingRepo: Repository<Meeting>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async seed() {
    const ceo = await this.employeeRepo.findOne({ where: { name: 'Mr. CEO' } });
    if (!ceo) {
      const ceo = this.employeeRepo.create({ name: 'Mr. CEO' });
      await this.employeeRepo.save(ceo);

      const ceoContactInfo = this.contactInfoRepo.create({
        email: 'test@test.com',
        phone: '245345',
      });
      ceoContactInfo.employeee = ceo;
      await this.contactInfoRepo.save(ceoContactInfo);

      const manager = this.employeeRepo.create({
        name: 'Marius',
        manager: ceo,
      });

      const task1 = this.taskRepo.create({ name: 'Hire people' });
      await this.taskRepo.save(task1);
      const task2 = this.taskRepo.create({ name: 'Present to CEO' });
      await this.taskRepo.save(task2);

      manager.tasks = [task1, task2];

      const meeting1 = this.meetingRepo.create({ zoomUrl: 'meeting.com' });
      meeting1.attendees = [ceo];
      await this.meetingRepo.save(meeting1);

      manager.meetings = [meeting1];

      await this.employeeRepo.save(manager);
      console.log('added');
      return;
    }
    return console.log('alrady exists');
  }

  getEmployeeById(id: number) {
    return this.employeeRepo.findOne({
      where: { id },
      relations: {
        manager: true,
        directReports: true,
        tasks: true,
        contactInfo: true,
        meetings: true,
      },
    });
  }

  deleteEmployee(id: number) {
    return this.employeeRepo.delete({ id });
  }

  deleteContactInfo(id: number) {
    this.contactInfoRepo.delete(id);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
