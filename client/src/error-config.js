const errorStates = {
  400: {
    code: '400',
    mode: 'toast',
    title: 'Bad request.',
    text: 'The request could not be processed. Please check the form data and try again.',
    severity: 'warn',
    life: 4200
  },
  401: {
    code: '401',
    mode: 'page',
    title: 'Sign in to continue.',
    text: 'Your session has expired or this page is available to signed-in users only.',
    actionLabel: 'Go back home',
    action: 'home'
  },
  403: {
    code: '403',
    mode: 'page',
    title: 'Access denied.',
    text: 'You do not have permission to view this page.',
    actionLabel: 'Go back home',
    action: 'home'
  },
  404: {
    code: '404',
    mode: 'page',
    title: 'Oops! Page not found.',
    text: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    actionLabel: 'Go back home',
    action: 'home'
  },
  408: {
    code: '408',
    mode: 'toast',
    title: 'Request timed out.',
    text: 'The server took too long to respond. Please try again.',
    severity: 'secondary',
    life: 4200
  },
  429: {
    code: '429',
    mode: 'toast',
    title: 'Too many requests.',
    text: 'You have made too many requests. Please wait a moment and try again.',
    severity: 'contrast',
    life: 4600
  },
  500: {
    code: '500',
    mode: 'page',
    title: 'Something went wrong.',
    text: 'We ran into an unexpected error while processing your request.',
    actionLabel: 'Try again',
    action: 'retry'
  },
  502: {
    code: '502',
    mode: 'page',
    title: 'Bad gateway.',
    text: 'A service we depend on returned an invalid response. Please try again shortly.',
    actionLabel: 'Try again',
    action: 'retry'
  },
  503: {
    code: '503',
    mode: 'page',
    title: 'Service temporarily unavailable.',
    text: 'The service is under maintenance or experiencing high traffic. Please try again later.',
    actionLabel: 'Try again',
    action: 'retry'
  },
  504: {
    code: '504',
    mode: 'page',
    title: 'Gateway timed out.',
    text: 'A service did not respond in time. Please try again in a moment.',
    actionLabel: 'Try again',
    action: 'retry'
  }
};

const fallbackErrorState = errorStates['500'];

export function getErrorState(code) {
  return errorStates[String(code)] ?? fallbackErrorState;
}

export function isToastErrorCode(code) {
  return getErrorState(code).mode === 'toast';
}

export function isPageErrorCode(code) {
  return getErrorState(code).mode === 'page';
}
