import { Text } from '../common/Text';
import { useMemo, useEffect, useRef } from 'react';

interface Message {
	id: string;
	content: string;
	time: string; // "2024-10-06T11:11:33.00183"
	type: string;
	senderId: string;
}

interface ChatMessageListProps {
	messages: Message[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
	const userId = localStorage.getItem('userId'); // 로컬스토리지에서 userId 가져오기

	// 스크롤을 제어하기 위한 ref
	const scrollRef = useRef<HTMLDivElement>(null);

	// 새로운 메시지가 추가될 때 스크롤을 아래로 이동
	useEffect(() => {
		const scrollToBottom = () => {
			scrollRef.current!.scrollIntoView({ behavior: 'smooth' });
		};
		scrollToBottom();
	}, [messages]); // 메시지가 바뀔 때마다 실행

	// 유효한 ISO 8601 형식이 아닌 경우 처리
	const parseDate = (time: string) => {
		// 만약 시간 문자열에 소수점이 있고 길다면, 이를 적절히 잘라서 처리
		if (time.includes('.')) {
			const [datePart, milliseconds] = time.split('.');
			const validTime = `${datePart}.${milliseconds.slice(0, 3)}`; // 소수점 이하 3자리까지만 사용
			const parsedDate = new Date(validTime);
			return isNaN(parsedDate.getTime()) ? new Date() : parsedDate; // 유효하지 않으면 현재 시간 반환
		} else {
			const parsedDate = new Date(time);
			return isNaN(parsedDate.getTime()) ? new Date() : parsedDate; // 유효하지 않으면 현재 시간 반환
		}
	};

	// 오래된 순서로 정렬된 메시지 목록을 생성
	const sortedMessages = useMemo(() => {
		return [...messages].sort(
			(a, b) => parseDate(a.time).getTime() - parseDate(b.time).getTime()
		);
	}, [messages]);

	// 날짜별로 메시지를 그룹화하는 함수
	const groupedMessages = useMemo(() => {
		return sortedMessages.reduce((groups, message) => {
			const date = parseDate(message.time).toLocaleDateString(); // 날짜만 추출 (YYYY-MM-DD)
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(message);
			return groups;
		}, {} as { [key: string]: Message[] });
	}, [sortedMessages]);

	// 시간 포맷팅 함수 (HH:MM 형식으로 변환)
	const formatTime = (time: string) => {
		const date = parseDate(time);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	// 날짜 포맷팅 함수 (YYYY년 M월 D일 요일 형식으로 변환)
	const formatDate = (time: string) => {
		const date = parseDate(time);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.toLocaleDateString('ko-KR', { weekday: 'long' });
		return `${year}년 ${month}월 ${day}일 ${weekday}`;
	};

	return (
		<section className="w-full flex flex-col grow overflow-y-auto mb-80pxr">
			{Object.keys(groupedMessages).map((date) => (
				<div key={date}>
					{/* 날짜 표시 */}
					<div className="w-full flex justify-center">
						<div className="py-5pxr px-12pxr rounded-20pxr bg-gray050 w-fit">
							<Text fontSize={12} fontWeight={500} color="gray700">
								{formatDate(groupedMessages[date][0].time)} {/* 날짜 포맷 */}
							</Text>
						</div>
					</div>
					<div className="h-24pxr" />

					{/* 날짜에 해당하는 메시지 목록 */}
					<div className="flex flex-col gap-12pxr px-20pxr w-full">
						{groupedMessages[date].map((message) => {
							const isMe = message.senderId === userId; // 본인 여부 판단

							return (
								<div
									key={message.time}
									className={`flex ${
										isMe ? 'justify-end' : 'justify-start'
									} items-end gap-8pxr`}
								>
									{!isMe && (
										<div className="px-12pxr max-w-192pxr py-8pxr bg-activeLylac100 rounded-b-8pxr rounded-tl-1pxr rounded-tr-8pxr">
											<Text fontSize={14} fontWeight={500} color="gray700">
												{message.content}
											</Text>
										</div>
									)}
									{isMe && (
										<div className="px-12pxr max-w-192pxr py-8pxr bg-[#E9F1FF] rounded-b-8pxr rounded-tl-8pxr rounded-tr-1pxr">
											<Text fontSize={14} fontWeight={500} color="gray700">
												{message.content}
											</Text>
										</div>
									)}
									<Text fontSize={12} fontWeight={400} color="gray500">
										{formatTime(message.time)} {/* 시간 포맷 */}
									</Text>
								</div>
							);
						})}
					</div>
				</div>
			))}
			<div ref={scrollRef} />
		</section>
	);
}
