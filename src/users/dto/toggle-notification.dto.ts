import { IsBoolean, IsEnum } from 'class-validator';
import { NotificationType } from 'src/utils/types';

export class ToggleNotificationDto {
  @IsEnum(NotificationType)
  notificationType: NotificationType;

  @IsBoolean()
  isEnabled: boolean;
}
