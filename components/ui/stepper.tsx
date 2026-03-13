import { Icon } from '@/components/ui/icon';
import React from 'react';
import { Text, View } from 'react-native';

interface StepperProps {
	steps: { id: string; title: string }[];
	currentStepIndex: number;
}

export const Stepper = ({ steps, currentStepIndex }: StepperProps) => {
	return (
		<View className='w-full mb-8'>
			<View className='flex flex-row relative px-4'>
				{steps.map((step, idx) => {
					const isCompleted = idx < currentStepIndex;
					const isActive = idx === currentStepIndex;
					const isLast = idx === steps.length - 1;

					return (
						<React.Fragment key={step.id}>
							<View className='flex flex-col items-center text-center relative'>
								<View
									className={`flex items-center justify-center w-8 h-8 rounded-full border border-border ${
										isCompleted || isActive
											? ' bg-primary-dark border-primary-dark text-white'
											: ' bg-white text-text'
									}`}
								>
									{isCompleted ? (
										<Icon name='Check' size={16} color='white' />
									) : (
										<Text
											className={`font-sans-medium text-xs ${isCompleted || isActive ? 'text-white' : 'text-text'}`}
										>
											{idx + 1}
										</Text>
									)}
								</View>
								<Text className='mt-2 text-2xs font-medium uppercase transition-colors duration-300'>
									{step.title}
								</Text>
							</View>
							{/* Connector Line */}
							{!isLast && (
								<View
									className={`flex-1 mt-4 h-0.5 bg-border ${isCompleted ? 'bg-primary-dark' : 'bg-border'}`}
								/>
							)}
						</React.Fragment>
					);
				})}

				{/* {steps.map((step, idx) => {
					const isCompleted = idx < currentStepIndex;
					const isLast = idx === steps.length - 1;

					if (!isLast) {
						return (
							<View
								key={step.id}
								className={`h-2 mt-3.5 ${isCompleted ? 'bg-primary-dark' : 'bg-red-400'}`}
							>
								<Text>xxx</Text>
							</View>
						);
					}

					return null;
				})} */}
			</View>
		</View>
	);
};
