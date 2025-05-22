export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean
    }
    private: {
      role: 'ADMIN_USER' | 'ADMIN_AGRI' | 'ADMIN ' | 'SUPER_ADMIN'
      isSuspended: boolean
      adminID: number
      isVerified: boolean
    }
  }
}
