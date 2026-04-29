import * as cp from 'cron-parser';
console.log(Object.keys(cp));
console.log(typeof cp.parseExpression);
console.log(cp.default ? Object.keys(cp.default) : 'no default');
