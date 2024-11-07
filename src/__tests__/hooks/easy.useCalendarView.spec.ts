import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';
import { assertDate } from '../utils.ts';

describe('초기 상태', () => {
  beforeEach(() => {
    vi.useRealTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    expect(result.current.view).toBe('month');
  });

  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    const mockDate = new Date(2024, 10, 1);
    vi.setSystemTime(mockDate);

    const { result } = renderHook(() => useCalendarView());
    assertDate(result.current.currentDate, mockDate);
  });

  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', () => {
    const mockDate = new Date(2024, 9, 1); // 2024년 10월 1일
    vi.setSystemTime(mockDate);

    const { result } = renderHook(() => useCalendarView());
    expect(result.current.holidays).toStrictEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });
});

it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
  const { result } = renderHook(() => useCalendarView());
  act(() => {
    result.current.setView('week');
  });

  expect(result.current.view).toBe('week');
});

it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
  const mockDate = new Date(2024, 10, 1); // 2024년 11월 1일
  vi.setSystemTime(mockDate);

  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('week');
  });

  act(() => {
    result.current.navigate('next');
  });

  // 각 날짜 구성요소 별로 비교
  const resultDate = result.current.currentDate;
  expect(resultDate.getFullYear()).toBe(2024);
  expect(resultDate.getMonth()).toBe(10);
  expect(resultDate.getDate()).toBe(8);
});

it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setCurrentDate(new Date('2024-10-01'));
  });

  act(() => {
    result.current.setView('week');
  });

  act(() => {
    result.current.navigate('prev');
  });

  const expectedDate = new Date('2024-09-24');

  expect(result.current.currentDate.toISOString()).toBe(expectedDate.toISOString());
});

it("월간 뷰에서 다음으로 navigate시 한 달 전 '2024-11-01' 날짜여야 한다", () => {
  const mockDate = new Date(2024, 9, 15);
  vi.setSystemTime(mockDate);

  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('month');
    result.current.navigate('next');
  });

  assertDate(result.current.currentDate, new Date(2024, 10, 1));
});

it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
  const mockDate = new Date(2024, 9, 15); // 2024년 10월 15일
  vi.setSystemTime(mockDate);

  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setView('month');
    result.current.navigate('prev');
  });

  assertDate(result.current.currentDate, new Date(2024, 8, 1));
});

it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
  // 타이머 초기화 및 설정
  vi.useRealTimers();
  vi.useFakeTimers();

  const mockDate = new Date(2024, 0, 1); // 2024년 1월 1일
  vi.setSystemTime(mockDate);

  const { result } = renderHook(() => useCalendarView());

  act(() => {
    result.current.setCurrentDate(new Date(2024, 0, 1));
  });

  await vi.runAllTimersAsync();

  expect(result.current.holidays).toStrictEqual({
    '2024-01-01': '신정',
  });

  // 테스트 종료 후 타이머 정리
  vi.useRealTimers();
});
