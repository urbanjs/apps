export default `
type User {
  id: ID!
  facebookRegistration: UserFacebookRegistration!
  personalInformation: UserPersonalInformation
  metadata: UserMetadata
  settings: UserSettings
  addresses: [Address]
  portfolio: UserPortfolio
  subscription: UserSubscription!
  jobs: [Job]
}
`;