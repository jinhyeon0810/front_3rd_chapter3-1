import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '주간 회의',
    date: '2024-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '팀 업무 논의',
    location: '회의실 A',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '2',
    title: '점심 식사',
    date: '2024-10-01',
    startTime: '12:00',
    endTime: '13:00',
    description: '팀 회식',
    location: '식당',
    category: '회식',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '3',
    title: '고객 미팅',
    date: '2024-10-15',
    startTime: '14:00',
    endTime: '15:00',
    description: '신규 프로젝트 회의',
    location: '회의실 B',
    category: '미팅',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 15,
  },
];

const currentDate = new Date(2024, 9, 1);

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

  expect(result.current.filteredEvents).toHaveLength(3);
  expect(result.current.filteredEvents).toEqual(mockEvents);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toHaveLength(2);
  expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1', '3']);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의실');
  });

  expect(result.current.filteredEvents).toHaveLength(2);
  expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1', '3']);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(mockEvents, currentDate, 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toHaveLength(2);
  expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1', '3']);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toHaveLength(1);
  expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['2']);
});
