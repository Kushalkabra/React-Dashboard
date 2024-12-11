export const REGIONS: Region[] = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania'
];

export const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'Year to date', value: 'ytd' },
  { label: 'All time', value: 'all' }
] as const;

export const CHART_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

export const USERS_PER_PAGE = 5; 