export interface ProfileResponse {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
}
