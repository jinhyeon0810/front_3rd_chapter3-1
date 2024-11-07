import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '곧 시작할 이벤트',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10, // 10분 전 알림
    },
    {
      id: '2',
      title: '나중 이벤트',
      date: '2024-07-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 30, // 30분 전 알림
    },
    {
      id: '3',
      title: '이미 알림 간 이벤트',
      date: '2024-07-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 15, // 15분 전 알림
    },
  ];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-07-01T09:50:00'); // 이벤트 1 시작 10분 전
    const result = getUpcomingEvents(mockEvents, now, []);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-07-01T10:45:00'); // 이벤트 3 시작 15분 전
    const notifiedEvents = ['3']; // 이미 알림이 간 이벤트
    const result = getUpcomingEvents(mockEvents, now, notifiedEvents);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T13:00:00'); // 이벤트 2 시작 60분 전
    const result = getUpcomingEvents(mockEvents, now, []);

    expect(result).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T09:45:00'); // 이벤트 1 시작 15분 전
    const result = getUpcomingEvents(mockEvents, now, []);

    expect(result).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      id: '1',
      title: '중요 회의',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const message = createNotificationMessage(event);
    expect(message).toBe('10분 후 중요 회의 일정이 시작됩니다.');
  });
});
