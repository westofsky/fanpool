import { IconLink, IconShare } from '@/public/icons';
import Button from '../common/Button';
import Bookmark from '../common/Bookmark';
import { FanpoolInformation } from '@/types/types';

interface FanpoolDetailBottomBarProps {
	fanpoolInformation: FanpoolInformation;
}

export default function FanpoolDetailBottomBar({
	fanpoolInformation,
}: FanpoolDetailBottomBarProps) {
	// 현재 내가 호스트인지 확인 (임의로 설정)
	const isHost = false; // 필요한 경우 실제 로직을 구현하세요

	return (
		<section
			className="fixed bottom-0 w-full h-86pxr bg-white px-20pxr pt-16pxr pb-20pxr rounded-16pxr flex gap-8pxr"
			style={{ boxShadow: '0px 0px 34px 0px rgba(0, 37, 97, 0.10)' }}
		>
			<Button
				height="50px"
				text={isHost ? '모집 완료하기' : '채팅하기'}
				borderRadius={8}
				enabledTextColor={'text-white'}
				enabledBackgroundColor={'bg-primary'}
				disabledTextColor={'text-gray300'}
				disabledBackgroundColor={'bg-gray100'}
				onClick={() => {}}
			/>
			<div className="w-40pxr h-48pxr flex items-center justify-center">
				<IconShare />
			</div>
			<div className="w-40pxr h-48pxr flex items-center justify-center">
				<IconLink />
			</div>
			{!isHost && (
				<div className="w-40pxr h-48pxr flex items-center justify-center">
					<Bookmark isChecked={true} onClick={() => {}} />
				</div>
			)}
		</section>
	);
}
