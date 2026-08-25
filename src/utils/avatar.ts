import { Student } from '../types';

/**
 * Standardized single source of truth for student avatars
 */
export function getStudentAvatar(student: Student | Partial<Student> | null | undefined): string {
  if (!student) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  if (student.avatarUrl && student.avatarUrl.trim()) {
    return student.avatarUrl;
  }

  if (student.profileImage && student.profileImage.trim()) {
    return student.profileImage;
  }

  if (student.avatar && student.avatar.trim()) {
    return student.avatar;
  }

  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
}
