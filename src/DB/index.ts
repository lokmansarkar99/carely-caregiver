import colors from 'colors';
import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES, STATUS, VERIFICATION_STATUS } from '../enums/user';
import { logger } from '../shared/logger';

/**
 * Seeds the super-admin on first boot.
 * Idempotent — skips if an ADMIN already exists.
 */
const seedAdmin = async (): Promise<void> => {
  const exists = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!exists) {
    await User.create({
      name:               'Carely Admin',
      email:              config.admin.email,
      password:           config.admin.password,
      role:               USER_ROLES.ADMIN,
      status:             STATUS.ACTIVE,
      verified:           true,
      verificationStatus: VERIFICATION_STATUS.VERIFIED,
    });
    logger.info(colors.green('✓ Super admin seeded successfully!'));
  }
};

export default seedAdmin;