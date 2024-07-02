export const canUserBookEvent = (user, event) => {
  const now = new Date();
  const eventStartDate = new Date(event.start);
  const planEndDate = user.plan_end_date ? new Date(user.plan_end_date) : null;
  const trialEndDate = user.trialEnd ? new Date(user.trialEnd) : null;

  // Check if the user has an active plan that includes the event
  if (
    user.stripeCurrentPlan &&
    planEndDate >= now &&
    isEventIncludedInPlan(user.stripeCurrentPlan, event.title)
  ) {
    return { canBook: true };
  }

  // Check if the user has applicable and active bundles for the event
  if (user.bundles && user.bundles.length > 0) {
    const hasActiveBundle = user.bundles.some(
      (bundle) =>
        isEventIncludedInBundle(bundle.bundleName, event.title) &&
        bundle.qty > 0 &&
        (bundle.bundleExpire === null || !hasBundleExpired(bundle.bundleExpire))
    );

    if (hasActiveBundle) {
      return { canBook: true };
    }
  }

  // Check if the trial period is still active and allows booking the event
  if (trialEndDate && eventStartDate <= trialEndDate && trialEndDate >= now) {
    return { canBook: true };
  }

  // At this point, all possibilities for booking have been checked.
  // If none are met, determine the reason for disallowance.

  if (trialEndDate && eventStartDate > trialEndDate) {
    return { canBook: false, reason: 'trialPeriodEnded' };
  }

  return { canBook: false, reason: 'noValidBundleOrPlan' };
};
