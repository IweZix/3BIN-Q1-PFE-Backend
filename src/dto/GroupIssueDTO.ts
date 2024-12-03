import { IsString, IsNotEmpty } from 'class-validator';

export class GroupIssueDTO {
    @IsString()
    @IsNotEmpty()
    groupIssueName: string;
}
