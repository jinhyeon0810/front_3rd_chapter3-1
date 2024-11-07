import { Event } from '../../types';
import {
  fillZero,
  formatDate,
  formatMonth,
  formatWeek,
  getDaysInMonth,
  getEventsForDay,
  getWeekDates,
  getWeeksAtMonth,
  isDateInRange,
} from '../../utils/dateUtils';

describe('getDaysInMonth', () => {
  it('1월은 31일 수를 반환한다', () => {
    expect(getDaysInMonth(2024, 1)).toBe(31);
  });

  it('4월은 30일 일수를 반환한다', () => {
    expect(getDaysInMonth(2024, 4)).toBe(30);
  });

  it('윤년의 2월에 대해 29일을 반환한다', () => {
    expect(getDaysInMonth(2024, 2)).toBe(29);
  });

  it('평년의 2월에 대해 28일을 반환한다', () => {
    expect(getDaysInMonth(2023, 2)).toBe(28);
  });

  it('유효하지 않은 월에 대해 적절히 처리한다', () => {
    expect(getDaysInMonth(2024, 0)).toBe(31);
    expect(getDaysInMonth(2024, 13)).toBe(31);
  });
});

describe('getWeekDates', () => {
  it('주중의 날짜(수요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2024, 6, 10);
    const weekDates = getWeekDates(date);

    expect(weekDates).toHaveLength(7);
    expect(weekDates[6].getDate()).toBe(13);
  });

  it('주의 시작(월요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2024, 6, 8);
    const weekDates = getWeekDates(date);

    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].getDate()).toBe(7);
    expect(weekDates[1].getDate()).toBe(8);
    expect(weekDates[6].getDate()).toBe(13);
  });

  it('주의 끝(일요일)에 대해 올바른 주의 날짜들을 반환한다', () => {
    const date = new Date(2024, 6, 7);
    const weekDates = getWeekDates(date);

    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].getDate()).toBe(7);
    expect(weekDates[6].getDate()).toBe(13);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연말)', () => {
    const date = new Date(2024, 11, 29);
    const weekDates = getWeekDates(date);

    expect(weekDates[0].getFullYear()).toBe(2024);
    expect(weekDates[6].getFullYear()).toBe(2025);
  });

  it('연도를 넘어가는 주의 날짜를 정확히 처리한다 (연초)', () => {
    const date = new Date(2024, 11, 29);
    const weekDates = getWeekDates(date);

    expect(weekDates[0].getFullYear()).toBe(2024);
    expect(weekDates[6].getFullYear()).toBe(2025);
  });

  it('윤년의 2월 29일을 포함한 주를 올바르게 처리한다', () => {
    const date = new Date(2024, 1, 29);
    const weekDates = getWeekDates(date);

    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].getDate()).toBe(25);
    expect(weekDates[4].getDate()).toBe(29);
    expect(weekDates[6].getDate()).toBe(2);
  });

  it('월의 마지막 날짜를 포함한 주를 올바르게 처리한다', () => {
    const date = new Date(2024, 6, 31);
    const weekDates = getWeekDates(date);

    expect(weekDates).toHaveLength(7);
    expect(weekDates[0].getDate()).toBe(28);
    expect(weekDates[3].getDate()).toBe(31);
    expect(weekDates[6].getDate()).toBe(3);
  });
});

describe('getWeeksAtMonth', () => {
  it('2024년 7월 1일의 올바른 주 정보를 반환해야 한다', () => {
    const date = new Date(2024, 6, 1);
    const weeks = getWeeksAtMonth(date);

    expect(weeks).toHaveLength(5);
    expect(weeks[0][0]).toBe(null);
    expect(weeks[0][1]).toBe(1);
    expect(weeks[4][2]).toBe(30);
  });
});

describe('getEventsForDay', () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '설명 1',
      location: '장소 1',
      category: '카테고리 1',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2024-07-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '설명 2',
      location: '장소 2',
      category: '카테고리 2',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2024-07-02',
      startTime: '11:00',
      endTime: '12:00',
      description: '설명 3',
      location: '장소 3',
      category: '카테고리 3',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it('특정 날짜(1일)에 해당하는 이벤트만 정확히 반환한다', () => {
    const result = getEventsForDay(mockEvents, 1);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('해당 날짜에 이벤트가 없을 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 3);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('날짜가 0일 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 0);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('날짜가 32일 이상인 경우 빈 배열을 반환한다', () => {
    const result = getEventsForDay(mockEvents, 32);
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});

describe('formatWeek', () => {
  it('월의 중간 날짜에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 15);
    expect(formatWeek(date)).toBe('2024년 7월 3주');
  });

  it('월의 첫 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 1);
    expect(formatWeek(date)).toBe('2024년 7월 1주');
  });

  it('월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 6, 31);
    expect(formatWeek(date)).toBe('2024년 8월 1주');
  });

  it('연도가 바뀌는 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 11, 31);
    expect(formatWeek(date)).toBe('2025년 1월 1주');
  });

  it('윤년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2024, 1, 29);
    expect(formatWeek(date)).toBe('2024년 2월 5주');
  });

  it('평년 2월의 마지막 주에 대해 올바른 주 정보를 반환한다', () => {
    const date = new Date(2023, 1, 23);
    expect(formatWeek(date)).toBe('2023년 2월 4주');
  });

  describe('formatMonth', () => {
    it("2024년 7월 10일을 '2024년 7월'로 반환한다", () => {
      const date = new Date(2024, 6, 10);
      expect(formatMonth(date)).toBe('2024년 7월');
    });
  });

  describe('isDateInRange', () => {
    const rangeStart = new Date('2024-07-01');
    const rangeEnd = new Date('2024-07-31');

    it('범위 내의 날짜 2024-07-10에 대해 true를 반환한다', () => {
      const date = new Date('2024-07-10');
      expect(isDateInRange(date, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위의 시작일 2024-07-01에 대해 true를 반환한다', () => {
      expect(isDateInRange(rangeStart, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위의 종료일 2024-07-31에 대해 true를 반환한다', () => {
      expect(isDateInRange(rangeEnd, rangeStart, rangeEnd)).toBe(true);
    });

    it('범위 이전의 날짜 2024-06-30에 대해 false를 반환한다', () => {
      const date = new Date('2024-06-30');
      expect(isDateInRange(date, rangeStart, rangeEnd)).toBe(false);
    });

    it('범위 이후의 날짜 2024-08-01에 대해 false를 반환한다', () => {
      const date = new Date('2024-08-01');
      expect(isDateInRange(date, rangeStart, rangeEnd)).toBe(false);
    });

    it('시작일이 종료일보다 늦은 경우 모든 날짜에 대해 false를 반환한다', () => {
      const date = new Date('2024-07-15');
      expect(isDateInRange(date, rangeEnd, rangeStart)).toBe(false);
    });
  });

  describe('fillZero', () => {
    test("5를 2자리로 변환하면 '05'를 반환한다", () => {
      expect(fillZero(5)).toBe('05');
    });

    test("10을 2자리로 변환하면 '10'을 반환한다", () => {
      expect(fillZero(10)).toBe('10');
    });

    test("3을 3자리로 변환하면 '003'을 반환한다", () => {
      expect(fillZero(3, 3)).toBe('003');
    });

    test("100을 2자리로 변환하면 '100'을 반환한다", () => {
      expect(fillZero(100, 2)).toBe('100');
    });

    test("0을 2자리로 변환하면 '00'을 반환한다", () => {
      expect(fillZero(0)).toBe('00');
    });

    test("1을 5자리로 변환하면 '00001'을 반환한다", () => {
      expect(fillZero(1, 5)).toBe('00001');
    });

    test("소수점이 있는 3.14를 5자리로 변환하면 '03.14'를 반환한다", () => {
      expect(fillZero(3.14, 5)).toBe('03.14');
    });

    test('size 파라미터를 생략하면 기본값 2를 사용한다', () => {
      expect(fillZero(7)).toBe('07');
    });

    test('value가 지정된 size보다 큰 자릿수를 가지면 원래 값을 그대로 반환한다', () => {
      expect(fillZero(123, 2)).toBe('123');
    });
  });

  describe('formatDate', () => {
    it('날짜를 YYYY-MM-DD 형식으로 포맷팅한다', () => {
      const date = new Date(2024, 6, 15);
      expect(formatDate(date)).toBe('2024-07-15');
    });

    it('day 파라미터가 제공되면 해당 일자로 포맷팅한다', () => {
      const date = new Date(2024, 6, 15);
      expect(formatDate(date, 20)).toBe('2024-07-20');
    });

    it('월이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date)).toBe('2024-06-15');

      const date2 = new Date(2024, 0, 15);
      expect(formatDate(date2)).toBe('2024-01-15');
    });

    it('일이 한 자리 수일 때 앞에 0을 붙여 포맷팅한다', () => {
      const date = new Date(2024, 6, 5);
      expect(formatDate(date)).toBe('2024-07-05');

      const date2 = new Date(2024, 6, 1);
      expect(formatDate(date2)).toBe('2024-07-01');
    });
  });
});
