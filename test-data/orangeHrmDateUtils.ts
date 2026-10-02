type LeaveRange = {
  fromDate: string;
  toDate: string;
};

export function getFutureLeaveDates(
  existingLeaves: LeaveRange[] = [],
): LeaveRange {
  const candidateDate = new Date();

  candidateDate.setHours(0, 0, 0, 0);
  candidateDate.setDate(candidateDate.getDate() + 1);

  while (true) {
    const dayOfWeek = candidateDate.getDay();

    const isWorkingDay = dayOfWeek !== 0 && dayOfWeek !== 6;

    if (!isWorkingDay) {
      candidateDate.setDate(candidateDate.getDate() + 1);
      continue;
    }

    const overlaps = existingLeaves.some((leave) => {
      const existingFrom = parseOrangeHrmDate(leave.fromDate);

      const existingTo = parseOrangeHrmDate(leave.toDate);

      return candidateDate >= existingFrom && candidateDate <= existingTo;
    });

    if (!overlaps) {
      const formattedDate = formatDate(candidateDate);

      return {
        fromDate: formattedDate,
        toDate: formattedDate,
      };
    }

    candidateDate.setDate(candidateDate.getDate() + 1);
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${day}-${month}`;
}

function parseOrangeHrmDate(date: string): Date {
  const [year, day, month] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}
