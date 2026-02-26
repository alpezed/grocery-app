import Icon from '@/components/ui/icon';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
	ImageBackground,
	ImageSourcePropType,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	StatusBar,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

export default function AuthLayout({
	title,
	subtitle,
	bgImage,
	children,
}: {
	bgImage?: ImageSourcePropType;
	title?: string;
	subtitle?: string;
	children: React.ReactNode;
}) {
	const router = useRouter();

	const handleBack = () => {
		router.back();
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle='light-content' />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ImageBackground
						source={bgImage}
						style={styles.background}
						imageStyle={styles.image}
					>
						<View style={styles.backButtonContainer}>
							<Pressable onPress={handleBack} style={styles.backButton}>
								<Icon
									name='ArrowLeft'
									size={24}
									color={Colors.light.background}
								/>
							</Pressable>
							<Text style={styles.backButtonText}>Welcome</Text>
						</View>
						<View style={styles.formContainer}>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>{title}</Text>
								<Text style={styles.subtitle}>{subtitle}</Text>
							</View>
							<View>{children}</View>
						</View>
					</ImageBackground>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	background: {
		width: '100%',
		height: '100%',
		justifyContent: 'space-between',
	},
	image: {
		top: 0,
		bottom: 0,
		height: 600,
		alignSelf: 'flex-start',
		resizeMode: 'cover',
	},
	container: {
		flex: 1,
		backgroundColor: Colors.light.background,
	},
	formContainer: {
		position: 'absolute',
		bottom: 0,
		paddingHorizontal: 20,
		paddingVertical: 30,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		backgroundColor: Colors.light.backgroundLight,
		width: '100%',
		gap: 22,
		// flex: 0.2,
		// paddingBottom: 150,
	},
	titleContainer: {
		gap: 8,
	},
	title: {
		fontSize: 25,
		fontFamily: 'Montserrat-Bold',
		color: 'black',
	},
	subtitle: {
		fontSize: 16,
		color: Colors.light.text,
		fontFamily: 'Montserrat',
	},
	backButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 50,
		paddingHorizontal: 20,
		paddingVertical: 10,
		width: '100%',
	},
	backButtonText: {
		fontSize: 18,
		fontFamily: 'Montserrat-SemiBold',
		color: Colors.light.background,
	},
	backButton: {
		position: 'absolute',
		left: 10,
	},
});
