export const canUserBookEvent = (user, event) => {
  console.log('user:', user, 'event:', event);
  const credits = user.creditBalance;
  if (credits > 0 && credits > event.crediti) {
    return { canBook: true };
  } else return { canBook: false, reason: 'noCredits' };
};
