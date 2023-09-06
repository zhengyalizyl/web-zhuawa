const isProduction = process.env.PRODUCTION || false;
const paginationOptions = {
  query: {
    page: {
      name: 'page',
      default: 1,
    },
    limit: {
      name: 'limit',
      default: 25,
    },
    pagination: {
      name: 'pagination',
      default: true,
    },
    invalid: 'defaults',
  },
  meta: {
    baseUri: isProduction ? process.env.BASE_URI : undefined,
    name: 'meta',
    count: {
      active: true,
      name: 'count',
    },
    totalCount: {
      active: true,
    },
    pageCount: {
      active: false,
    },
    self: {
      active: false,
    },
    previous: {
      active: true,
    },
    next: {
      active: true,
    },
    first: {
      active: false,
    },
    last: {
      active: false,
    },
    page: {
      active: false,
    },
    limit: {
      active: false,
    },
  },
  results: {
    name: 'results',
  },
  reply: {
    paginate: 'paginate',
  },
  routes: {
    include: ['*'],
    exclude: [],
  },
};

module.exports.paginationOptions = paginationOptions;
