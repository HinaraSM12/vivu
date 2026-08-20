import concurrently from 'concurrently';

const services = [
  ['web', 'npm:dev -w @vivu/web'],
  ['gateway', 'npm:dev -w @vivu/api-gateway'],
  ['identity', 'npm:dev -w @vivu/identity-service'],
  ['student', 'npm:dev -w @vivu/student-service'],
  ['gamification', 'npm:dev -w @vivu/gamification-service'],
  ['resource', 'npm:dev -w @vivu/resource-service'],
  ['survey', 'npm:dev -w @vivu/survey-service'],
  ['support', 'npm:dev -w @vivu/support-service'],
  ['analytics', 'npm:dev -w @vivu/analytics-service'],
];

const { result } = concurrently(
  services.map(([name, command]) => ({ name, command })),
  {
    killOthers: ['failure'],
    prefixColors: 'auto',
  },
);

await result;

