import { Component, OnInit } from '@angular/core';
import { Day } from '../models/day.model';
import { calendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  daysInMonth: Day[];
  monthNumber: number;
  monthName: string;
  year: number;
  weekDaysName = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  currentYear: number; 
  currentMonthIndex: number;

  constructor(public calendarService: calendarService) {
    let date = new Date();
    this.currentYear = date.getFullYear(); // 2022
    this.currentMonthIndex = date.getMonth(); // 2
  }

  ngOnInit(): void {
    this.setMonthDays(this.getCurrentMonth());
    this.monthName = this.calendarService.getMonthName(this.monthNumber);
  }
  
  getCurrentMonth(): Day[] {
    return this.getMonth(this.currentMonthIndex, this.currentYear);
  }

  getMonth(monthIndex: number, year: number): Day[] {
    let days = [];

    let firstday = this.createDay(1, monthIndex, year);

    // kreira prazna polja iz prethodnog meseca ako postoje u prvoj nedelji meseca
    for (let i = 1; i < firstday.weekDayNumber; i++) {
      
      days.push({
        weekDayNumber: i,
        monthIndex: monthIndex,
        year: year,
      } as Day);
    }
    console.log(firstday);

    days.push(firstday);
    
    // kreira ostale dane u mesecu
    let countDaysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    for (let i = 2; i < countDaysInMonth + 1; i++) {
      days.push(this.createDay(i, monthIndex, year));
    }
    console.log(days);
    return days;
  }

  // Funkcija koja inicijalize Day model
  createDay(dayNumber: number, monthIndex: number, year: number) {
    let day = new Day();

    day.monthIndex = monthIndex;
    day.month = this.calendarService.getMonthName(monthIndex);

    day.number = dayNumber;
    day.year = this.currentYear;

    day.weekDayNumber = new Date(year, monthIndex, dayNumber).getDay();
    day.weekDayName = this.calendarService.getWeekDayName(day.weekDayNumber);
    
    day.isToday = new Date(this.currentYear, day.monthIndex, dayNumber).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);

    return day;
  }

  onNextMonth(): void {
    this.monthNumber++;
    
    if (this.monthNumber == 12) {
      this.monthNumber = 0;
      this.currentYear++
    }

    this.setMonthDays(this.getMonth(this.monthNumber, this.currentYear));

    this.monthName = this.calendarService.getMonthName(this.monthNumber);
  }

  onPreviousMonth(): void {
    this.monthNumber--;

    if (this.monthNumber < 0) {
      this.monthNumber = 11;
      this.currentYear--;
    }

    this.setMonthDays(this.getMonth(this.monthNumber, this.currentYear));

    this.monthName = this.calendarService.getMonthName(this.monthNumber);
  }

  setMonthDays(days: Day[]): void {
    this.daysInMonth = days;
    this.monthNumber = this.daysInMonth[0].monthIndex;
    this.year = this.daysInMonth[0].year;
  }

}
