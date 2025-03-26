import { FileStorage } from '../storage/file-storage';
import { User } from '../../shared/types/auth';
import bcrypt from 'bcryptjs';

const userStorage = new FileStorage<User>('users');

async function resetUserPassword(username: string, newPassword: string) {
  try {
    // Find user by username
    const users = await userStorage.query(user => user.username === username);
    const user = users[0];

    if (!user) {
      console.error(`User not found: ${username}`);
      return false;
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user with new password hash
    const updatedUser: User = {
      ...user,
      passwordHash
    };

    // Save the updated user
    await userStorage.set(user.id, updatedUser);
    console.log(`Successfully reset password for user: ${username}`);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    return false;
  }
}

// Allow script to be run from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log('Usage: ts-node reset-password.ts <username> <newPassword>');
    process.exit(1);
  }

  const [username, newPassword] = args;
  resetUserPassword(username, newPassword)
    .then(success => {
      if (success) {
        console.log('Password reset completed successfully');
        process.exit(0);
      } else {
        console.error('Password reset failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

export { resetUserPassword }; 