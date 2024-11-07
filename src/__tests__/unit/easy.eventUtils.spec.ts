import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01', // 월요일
      startTime: '09:00',
      endTime: '10:00',
      description: '첫 번째 이벤트',
      location: '회의실 A',
      category: '회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-03', // 수요일
      startTime: '14:00',
      endTime: '15:00',
      description: '두 번째 이벤트',
      location: '회의실 B',
      category: '회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '3',
      title: 'EVENT 3',
      date: '2024-07-15', // 다음 주 월요일
      startTime: '11:00',
      endTime: '12:00',
      description: '세 번째 이벤트',
      location: '회의실 C',
      category: '회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2024-06-30', // 이전 월
      startTime: '16:00',
      endTime: '17:00',
      description: '네 번째 이벤트',
      location: '회의실 D',
      category: '회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 0,
    },
  ];

  const currentDate = new Date('2024-07-01');

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(mockEvents, '이벤트 2', currentDate, 'month');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(mockEvents, '', currentDate, 'week');
    expect(result).toHaveLength(3);

    // 순서 상관없이 id들이 포함되어 있는지 확인
    const expectedIds = ['4', '1', '2'];
    expect(result.map((e) => e.id).sort()).toEqual(expectedIds.sort());
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const currentDate = new Date(2024, 6, 1); // 2024년 7월 1일로 명시적 설정
    const result = getFilteredEvents(mockEvents, '', currentDate, 'month');

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['1', '2', '3']);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(mockEvents, '이벤트', currentDate, 'week');
    expect(result).toHaveLength(3);
    expect(new Set(result.map((e) => e.id))).toEqual(new Set(['4', '1', '2']));
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const currentDate = new Date(2024, 6, 1);
    const result = getFilteredEvents(mockEvents, '', currentDate, 'month');

    expect(result).toHaveLength(3);

    const expectedIds = ['1', '2', '3'];
    expect(result.map((e) => e.id).sort()).toEqual(expectedIds);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const currentDate = new Date(2024, 6, 1); // 2024년 7월 1일

    // 영문 'event'로 검색하면 'EVENT 3'만 검색되어야 함
    const resultLower = getFilteredEvents(mockEvents, 'event', currentDate, 'month');
    const resultUpper = getFilteredEvents(mockEvents, 'EVENT', currentDate, 'month');

    // 각각 하나의 결과만 있어야 함
    expect(resultLower).toHaveLength(1);
    expect(resultUpper).toHaveLength(1);

    // id가 3인 'EVENT 3'만 검색되어야 함
    expect(resultLower[0].id).toBe('3');
    expect(resultUpper[0].id).toBe('3');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    // 6월 마지막 주 테스트
    const lastWeekOfJune = new Date('2024-06-30');
    const resultWeek = getFilteredEvents(mockEvents, '', lastWeekOfJune, 'week');
    expect(resultWeek.map((e) => e.id)).toContain('4');
    expect(resultWeek.map((e) => e.id)).toContain('1');

    // 7월 첫 주 테스트
    const firstWeekOfJuly = new Date('2024-07-01');
    const resultMonth = getFilteredEvents(mockEvents, '', firstWeekOfJuly, 'month');
    expect(resultMonth.map((e) => e.id)).not.toContain('4');
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const result = getFilteredEvents([], '', currentDate, 'month');
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
