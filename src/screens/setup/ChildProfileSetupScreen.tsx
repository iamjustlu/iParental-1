import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '@react-native-community/datetimepicker';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeviceSetupGuide } from '@/components/setup/DeviceSetupGuide';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import { AgeGroup } from '@/types';

interface ChildProfileForm {
  name: string;
  dateOfBirth: Date;
  pin: string;
  confirmPin: string;
}

export const ChildProfileSetupScreen: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>(AgeGroup.CHILD);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<any>(null);

  const { createChildProfile, user } = useAuthStore();
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ChildProfileForm>({
    defaultValues: {
      dateOfBirth: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000), // 10 years ago
    },
  });

  const watchedDate = watch('dateOfBirth');
  const watchedPin = watch('pin');

  const ageGroups = [
    {
      id: AgeGroup.PRESCHOOL,
      title: 'Preschool (3-5)',
      description: 'Maximum protection for young children',
      icon: 'flower-outline',
      color: theme.colors.status.success,
    },
    {
      id: AgeGroup.CHILD,
      title: 'Child (6-12)',
      description: 'Balanced protection for school-age children',
      icon: 'school-outline',
      color: theme.colors.secondary,
    },
    {
      id: AgeGroup.TEEN,
      title: 'Teen (13-17)',
      description: 'Guided freedom for teenagers',
      icon: 'people-outline',
      color: theme.colors.status.warning,
    },
    {
      id: AgeGroup.CUSTOM,
      title: 'Custom',
      description: 'Create your own protection rules',
      icon: 'settings-outline',
      color: theme.colors.primary,
    },
  ];

  const calculateAgeGroup = (birthDate: Date): AgeGroup => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 6) return AgeGroup.PRESCHOOL;
    if (age < 13) return AgeGroup.CHILD;
    if (age < 18) return AgeGroup.TEEN;
    return AgeGroup.TEEN;
  };

  React.useEffect(() => {
    if (watchedDate) {
      const suggestedAgeGroup = calculateAgeGroup(watchedDate);
      setSelectedAgeGroup(suggestedAgeGroup);
    }
  }, [watchedDate]);

  const onSubmit = async (data: ChildProfileForm) => {
    if (data.pin !== data.confirmPin) {
      Alert.alert('Error', 'PIN codes do not match');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please log in first');
      return;
    }

    setIsLoading(true);

    try {
      const success = await createChildProfile({
        parentId: user.id,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        pin: data.pin,
        ageGroup: selectedAgeGroup,
        settings: {
          screenTimeLimit: 480,
          allowedApps: [],
          blockedApps: [],
          blockedWebsites: [],
          allowedWebsites: [],
          bedtime: '21:00',
          wakeTime: '07:00',
          contentFilterLevel: 'moderate' as any,
          homeworkMode: false,
          locationTrackingEnabled: true,
          taskRewardsEnabled: true,
        },
      });

      if (success) {
        setCreatedProfile({
          name: data.name,
          ageGroup: selectedAgeGroup,
          nextdnsConfigId: 'temp-config-id', // This would come from the actual creation
        });
        setShowSetupGuide(true);
      } else {
        Alert.alert('Error', 'Failed to create child profile');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAgeGroupSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Age Group</Text>
      <Text style={styles.sectionSubtitle}>
        Choose the appropriate protection level based on your child's age
      </Text>
      
      <View style={styles.ageGroupGrid}>
        {ageGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.ageGroupCard,
              selectedAgeGroup === group.id && [
                styles.selectedAgeGroupCard,
                { borderColor: group.color },
              ],
            ]}
            onPress={() => setSelectedAgeGroup(group.id)}
          >
            <View style={[
              styles.ageGroupIcon,
              { backgroundColor: `${group.color}20` },
            ]}>
              <Icon name={group.icon} size={24} color={group.color} />
            </View>
            
            <Text style={[
              styles.ageGroupTitle,
              selectedAgeGroup === group.id && { color: group.color },
            ]}>
              {group.title}
            </Text>
            
            <Text style={styles.ageGroupDescription}>
              {group.description}
            </Text>

            {selectedAgeGroup === group.id && (
              <View style={styles.selectedIndicator}>
                <Icon name="checkmark-circle" size={20} color={group.color} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Child Profile</Text>
        <Text style={styles.subtitle}>
          Set up protection and monitoring for your child's devices
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Child's Name"
                placeholder="Enter child's name"
                leftIcon="person-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <View style={styles.datePickerContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={styles.datePickerText}>
                {watchedDate.toLocaleDateString()}
              </Text>
              <Icon name="chevron-down-outline" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DatePicker
              value={watchedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setValue('dateOfBirth', selectedDate);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)}
            />
          )}
        </View>

        {/* Age Group Selection */}
        {renderAgeGroupSelector()}

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security PIN</Text>
          <Text style={styles.sectionSubtitle}>
            Create a PIN for your child to access certain features
          </Text>

          <Controller
            control={control}
            name="pin"
            rules={{
              required: 'PIN is required',
              pattern: {
                value: /^\d{4,6}$/,
                message: 'PIN must be 4-6 digits',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Create PIN"
                placeholder="Enter 4-6 digit PIN"
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.pin?.message}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPin"
            rules={{
              required: 'Please confirm your PIN',
              validate: (value) =>
                value === watchedPin || 'PINs do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm PIN"
                placeholder="Re-enter PIN"
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPin?.message}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
              />
            )}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={24} color={theme.colors.status.info} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              After creating the profile, you'll get step-by-step instructions to set up content filtering on your child's devices.
            </Text>
          </View>
        </View>

        <Button
          title="Create Profile"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          fullWidth
          style={styles.createButton}
        />
      </ScrollView>

      {/* Device Setup Guide Modal */}
      {createdProfile && (
        <DeviceSetupGuide
          childName={createdProfile.name}
          nextdnsConfigId={createdProfile.nextdnsConfigId}
          visible={showSetupGuide}
          onClose={() => {
            setShowSetupGuide(false);
            setCreatedProfile(null);
            // Navigate back or to dashboard
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },

  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },

  subtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  section: {
    marginBottom: theme.spacing[6],
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },

  sectionSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },

  datePickerContainer: {
    marginBottom: theme.spacing[4],
  },

  inputLabel: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2],
  },

  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    height: 48,
    paddingHorizontal: theme.spacing[4],
  },

  datePickerText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing[2],
  },

  ageGroupGrid: {
    gap: theme.spacing[3],
  },

  ageGroupCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },

  selectedAgeGroupCard: {
    backgroundColor: theme.colors.background.secondary,
  },

  ageGroupIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[3],
  },

  ageGroupTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  ageGroupDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  selectedIndicator: {
    position: 'absolute',
    top: theme.spacing[3],
    right: theme.spacing[3],
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.transparent.primary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
  },

  infoContent: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },

  infoTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.status.info,
    marginBottom: theme.spacing[1],
  },

  infoText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.info,
    lineHeight: theme.typography.lineHeights.normal,
  },

  createButton: {
    marginBottom: theme.spacing[6],
  },
});
