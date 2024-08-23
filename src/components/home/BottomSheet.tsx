import { useState } from 'react';
import { Text } from '../common/Text';
import { teams } from '@/constants/teams';
import SelectTeamButton from '../common/button/SelectTeamButton';

interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
	const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

	const handleTeamSelect = (code: string) => {
		setSelectedTeam(code);
	};

	const handleSelect = () => {
		onClose();
	};

	return (
		<section className="w-full">
			{/* 오버레이 */}
			<div
				className={`absolute inset-0 w-full bg-black transition-opacity duration-300 ${
					isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>

			{/* 바텀 시트 */}
			<div
				className={`absolute inset-x-0 bottom-0 w-full bg-white rounded-t-20pxr pt-24pxr px-20pxr transition-transform transform duration-300 ${
					isOpen ? 'translate-y-0' : 'translate-y-full'
				}`}
				style={{ zIndex: 1000 }}
			>
				<div className="flex flex-col pb-20pxr">
					<Text fontSize={20} fontWeight={700}>
						내가 응원하는 팀
					</Text>
					<Text fontSize={16} fontWeight={400}>
						응원 팀을 선택하면 홈 상단 배너에서 경기 일정을 알려드려요.{' '}
					</Text>
					<div className="h-18pxr" />

					<div className="grid grid-cols-3 gap-8pxr">
						{teams.map((team, index) => (
							<div key={team.code} className="mb-8pxr">
								<SelectTeamButton
									code={team.code}
									isSelected={selectedTeam === team.code}
									onClick={() => handleTeamSelect(team.code)}
								/>
							</div>
						))}
						{/* 팀이 없는 경우의 선택지를 추가 */}
						<div key="none" className="mb-8pxr">
							<SelectTeamButton
								code=""
								isSelected={selectedTeam === ''}
								onClick={() => handleTeamSelect('')}
							/>
						</div>
					</div>
					<div className="h-40pxr" />
					<div
						className="w-full py-11pxr px-14pxr bg-primary rounded-8pxr text-center cursor-pointer"
						onClick={handleSelect}
					>
						<Text fontSize={16} fontWeight={600} color="white">
							선택 완료
						</Text>
					</div>
				</div>
			</div>
		</section>
	);
}
