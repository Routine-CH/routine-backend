export const ApiResponseMessages = {
  success: {
    ok_200: {
      SIGNUP: 'Signup was successful',
      LOGIN: 'Login successful',
      LOGOUT: 'Logout successful',
      AUTHCHECK: 'Authenticated and login tracked',
      GOAL_UPDATED: 'Goal updated successfully',
      GOAL_DELETED: (goalTitle: string) =>
        `Goal "${goalTitle}" was succesfully deleted.`,
      JOURNAL_UPDATED: 'Journal updated successfully',
      JOURNAL_DELETED: (journalTitle: string) =>
        `Journal "${journalTitle}" was succesfully deleted.`,
      MEDITATION_UPDATED: 'Meditation updated successfully',
      POMODORO_TIMER_UPDATED: 'Pomodoro timer updated successfully',
    },
    created_201: {
      GOAL: 'Goal created successfully',
      JOURNAL: 'Journal created successfully',
    },
  },
  error: {
    bad_request_400: {
      USERNAME_TAKEN: 'Username already taken. Please try another username.',
      EMAIL_TAKEN: 'E-Mail already exists. Please try another E-Mail.',
      INVALID_PASSWORD:
        'The password you entered is incorrect. Please try again.',
      PASSWORDS_DO_NOT_MATCH: 'Passwords do not match. Please try again.',
      INVALID_REFRESH_TOKEN: 'Invalid refresh token. Please login again.',
      GENERAL_EXCEPTION: 'Oops! Something went wrong. Please try again.',
    },
    unauthorized_401: {
      UNAUTHORIZED: 'Oops! You are not authorized to perform this action.',
    },
    forbidden_403: {},
    not_found_404: {
      USER: 'User not found. Please check your username and try again.',
      TOKEN: 'Token not found. Please try again.',
      WEEKLY_GOALS: 'Opps! No goals found for this week.',
      DAILY_GOALS: 'Oops! No goals found for this day.',
      GOALS: `Oops! You don't have any goals yet.`,
      GOAL: 'Oops! Goal not found.',
      WEEKLY_JOURNALS: 'Oops! No journals found for this week.',
      DAILY_JOURNALS: 'Oops! No journals found for this day.',
      JOURNALS: `Oops! You don't have any journals yet.`,
      JOURNAL: 'Oops! Journal not found.',
      MEDITATIONS: `Oops! You don't have any meditations yet.`,
      POMODORO_TIMERS: `Oops! You don't have any pomodoro timers yet.`,
    },
    internal_server_error_500: {},
    bad_gateway_502: {},
  },
};
