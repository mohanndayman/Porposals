export const isApiProfileComplete = (userData) => {
  // Try different ways to extract profile data
  const profile = userData.data?.profile || userData.profile || userData;

  if (!profile) {
    return false;
  }

  const criticalFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "educational_level",
    "marital_status",
    "employment_status",
    "job_title",
    "financial_status",
  ];

  const filledCount = criticalFields.filter((field) => {
    const value = profile[field];
    const isFilled = value !== null && value !== undefined && value !== "";
    return isFilled;
  }).length;


  // Check for photos - make it more flexible
  const hasPhotos =
    profile.photos &&
    Array.isArray(profile.photos) &&
    profile.photos.length > 0;
  const hasAvatar = profile.avatar_url && profile.avatar_url !== "";


  // Consider profile complete if 80% of critical fields are filled AND either has photos or avatar
  const isComplete =
    filledCount >= criticalFields.length * 0.8 && (hasPhotos || hasAvatar);


  return isComplete;
};

export const isProfileEmpty = (userData) => {
  const profile = userData.data?.profile || userData.profile || userData;

  if (!profile) return true;

  const requiredFields = [
    "nationality",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "marital_status",
    "height",
    "weight",
  ];

  const emptyCount = requiredFields.filter(
    (field) =>
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
  ).length;

  return emptyCount > requiredFields.length * 0.7;
};

export const checkProfileCompletion = (userData) => {
  const profile = userData.data?.profile || userData.profile || userData;

  if (!profile) {
    return {
      isProfileComplete: false,
      missingFields: ["profile data missing"],
    };
  }

  const requiredFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "employment_status",
    "marital_status",
    "height",
    "weight",
  ];

  const requiredArrayFields = ["photos"];

  const missingFields = [];

  requiredFields.forEach((field) => {
    const value = profile[field];
    const isEmpty = value === null || value === undefined || value === "";
    const isEmploymentZero = field === "employment_status" && value === 0;

    if (isEmpty || isEmploymentZero) {
      missingFields.push(field);
    }
  });

  requiredArrayFields.forEach((field) => {
    const value = profile[field];
    const isEmpty = !value || !Array.isArray(value) || value.length === 0;

    if (isEmpty) {
      missingFields.push(field);
    }
  });

  const isProfileComplete = missingFields.length === 0;


  return {
    isProfileComplete,
    missingFields,
  };
};
