export const categorizeMeetups = (meetups) => {
  const currentDate = new Date(); // Get the current date and time

  const pendingMeetups = meetups.filter(
    (meetup) =>
      meetup.status === "pending" && new Date(meetup.date) > currentDate
  );

  const acceptedMeetups = meetups.filter(
    (meetup) =>
      meetup.status === "accepted" && new Date(meetup.date) > currentDate
  );

  const declinedMeetups = meetups.filter(
    (meetup) => meetup.status === "declined" // Declined meetups stay as declined regardless of date
  );

  const completedMeetups = meetups.filter(
    (meetup) =>
      (meetup.status === "completed" || new Date(meetup.date) <= currentDate) &&
      meetup.status != "declined"
  );

  return {
    pendingMeetups,
    acceptedMeetups,
    declinedMeetups,
    completedMeetups,
  };
};
