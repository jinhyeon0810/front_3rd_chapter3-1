import { Event, EventForm } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const result = parseDateTime('2024-07-01', '14:30');
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(6);
    expect(result.getDay()).toBe(1);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-14-01', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', '25:00');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  const validEvent: EventForm = {
    title: '테스트 이벤트',
    date: '2024-07-01',
    startTime: '14:30',
    endTime: '15:30',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  };

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const result = convertEventToDateRange(validEvent);

    expect(result.start.getHours()).toBe(14);
    expect(result.start.getMinutes()).toBe(30);
    expect(result.end.getHours()).toBe(15);
    expect(result.end.getMinutes()).toBe(30);
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent = { ...validEvent, date: '2024-13-01' };
    const result = convertEventToDateRange(invalidEvent);

    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const invalidEvent = { ...validEvent, startTime: '25:00' };
    const result = convertEventToDateRange(invalidEvent);

    expect(result.start.toString()).toBe('Invalid Date');
  });
});

describe('isOverlapping', () => {
  const event1: EventForm = {
    title: '이벤트 1',
    date: '2024-07-01',
    startTime: '14:00',
    endTime: '16:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  };
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event2: EventForm = {
      ...event1,
      startTime: '15:00',
      endTime: '17:00',
    };

    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event2: EventForm = {
      ...event1,
      startTime: '16:30',
      endTime: '17:30',
    };

    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const existingEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-01',
      startTime: '14:00',
      endTime: '16:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: EventForm = {
      title: '새 이벤트',
      date: '2024-07-01',
      startTime: '15:00',
      endTime: '17:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };

    const overlappingEvents = findOverlappingEvents(newEvent, existingEvents);
    expect(overlappingEvents).toHaveLength(1);
    expect(overlappingEvents[0].id).toBe('2');
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: EventForm = {
      title: '새 이벤트',
      date: '2024-07-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    };

    const overlappingEvents = findOverlappingEvents(newEvent, existingEvents);
    expect(overlappingEvents).toHaveLength(0);
  });
});
