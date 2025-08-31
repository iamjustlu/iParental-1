import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '@/components/ui/Button';
import { theme } from '@/theme';
import { nextdnsService } from '@/services/nextdnsService';

interface DeviceSetupGuideProps {
  childName: string;
  nextdnsConfigId: string;
  visible: boolean;
  onClose: () => void;
}

export const DeviceSetupGuide: React.FC<DeviceSetupGuideProps> = ({
  childName,
  nextdnsConfigId,
  visible,
  onClose,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<'ios' | 'android' | 'windows' | 'macos'>('ios');

  const deviceTypes = [
    { id: 'ios', name: 'iPhone/iPad', icon: 'phone-portrait-outline' },
    { id: 'android', name: 'Android', icon: 'phone-portrait-outline' },
    { id: 'windows', name: 'Windows', icon: 'desktop-outline' },
    { id: 'macos', name: 'macOS', icon: 'desktop-outline' },
  ] as const;

  const instructions = nextdnsService.generateDeviceSetupInstructions(nextdnsConfigId, selectedDevice);

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', 'DNS server address copied to clipboard');
  };

  const renderDeviceSelector = () => (
    <View style={styles.deviceSelector}>
      <Text style={styles.sectionTitle}>Select Device Type</Text>
      <View style={styles.deviceButtons}>
        {deviceTypes.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={[
              styles.deviceButton,
              selectedDevice === device.id && styles.selectedDeviceButton,
            ]}
            onPress={() => setSelectedDevice(device.id)}
          >
            <Icon
              name={device.icon}
              size={24}
              color={selectedDevice === device.id ? theme.colors.primary : theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.deviceButtonText,
                selectedDevice === device.id && styles.selectedDeviceButtonText,
              ]}
            >
              {device.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderDNSServers = () => (
    <View style={styles.dnsSection}>
      <Text style={styles.sectionTitle}>DNS Server Addresses</Text>
      <Text style={styles.sectionSubtitle}>
        You'll need these addresses during setup:
      </Text>
      
      {instructions.dnsServers.map((server, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dnsServer}
          onPress={() => copyToClipboard(server)}
        >
          <Text style={styles.dnsServerText}>{server}</Text>
          <Icon name="copy-outline" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      ))}
      
      <Text style={styles.copyHint}>
        Tap any address to copy it to your clipboard
      </Text>
    </View>
  );

  const renderInstructions = () => (
    <View style={styles.instructionsSection}>
      <Text style={styles.sectionTitle}>{instructions.title}</Text>
      <Text style={styles.sectionSubtitle}>
        Follow these steps on {childName}'s device:
      </Text>
      
      {instructions.steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}
    </View>
  );

  const renderTroubleshooting = () => (
    <View style={styles.troubleshootingSection}>
      <Text style={styles.sectionTitle}>Troubleshooting</Text>
      
      <View style={styles.troubleshootingItem}>
        <Icon name="help-circle-outline" size={20} color={theme.colors.status.warning} />
        <View style={styles.troubleshootingContent}>
          <Text style={styles.troubleshootingTitle}>Settings not found?</Text>
          <Text style={styles.troubleshootingText}>
            The exact location of DNS settings may vary depending on your device's OS version. 
            Look for "Network", "WiFi", or "Internet" settings.
          </Text>
        </View>
      </View>
      
      <View style={styles.troubleshootingItem}>
        <Icon name="warning-outline" size={20} color={theme.colors.status.error} />
        <View style={styles.troubleshootingContent}>
          <Text style={styles.troubleshootingTitle}>Can't save settings?</Text>
          <Text style={styles.troubleshootingText}>
            Some devices require administrator or parental permissions to change DNS settings. 
            Make sure you're logged in as an administrator.
          </Text>
        </View>
      </View>
      
      <View style={styles.troubleshootingItem}>
        <Icon name="checkmark-circle-outline" size={20} color={theme.colors.status.success} />
        <View style={styles.troubleshootingContent}>
          <Text style={styles.troubleshootingTitle}>Test the setup</Text>
          <Text style={styles.troubleshootingText}>
            After setup, try accessing a blocked website to verify the filtering is working. 
            You should see a NextDNS block page.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Device Setup</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <Icon name="shield-checkmark" size={48} color={theme.colors.primary} />
            <Text style={styles.introTitle}>Protect {childName}'s Device</Text>
            <Text style={styles.introText}>
              Follow these steps to set up content filtering and parental controls on {childName}'s device.
            </Text>
          </View>

          {renderDeviceSelector()}
          {renderDNSServers()}
          {renderInstructions()}
          {renderTroubleshooting()}

          <View style={styles.footer}>
            <Button
              title="Setup Complete"
              onPress={() => {
                Alert.alert(
                  'Setup Complete',
                  'Great! The device is now protected. You can monitor activity from the dashboard.',
                  [{ text: 'OK', onPress: onClose }]
                );
              }}
              fullWidth
            />
            
            <TouchableOpacity style={styles.helpButton} onPress={() => {
              Alert.alert('Need Help?', 'Contact support for assistance with device setup.');
            }}>
              <Icon name="help-circle-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.helpButtonText}>Need Help?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },

  closeButton: {
    padding: theme.spacing[2],
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  intro: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },

  introTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },

  introText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeights.relaxed,
  },

  deviceSelector: {
    marginBottom: theme.spacing[6],
  },

  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[3],
  },

  sectionSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[4],
  },

  deviceButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },

  deviceButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  selectedDeviceButton: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.transparent.primary,
  },

  deviceButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[2],
  },

  selectedDeviceButtonText: {
    color: theme.colors.primary,
  },

  dnsSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },

  dnsServer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },

  dnsServerText: {
    fontSize: theme.typography.fontSizes.sm,
    fontFamily: 'monospace',
    color: theme.colors.text.primary,
    flex: 1,
  },

  copyHint: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },

  instructionsSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },

  stepContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },

  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
    marginTop: theme.spacing[1],
  },

  stepNumberText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  stepText: {
    flex: 1,
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeights.normal,
    paddingTop: theme.spacing[1],
  },

  troubleshootingSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },

  troubleshootingItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },

  troubleshootingContent: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },

  troubleshootingTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  troubleshootingText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeights.normal,
  },

  footer: {
    paddingVertical: theme.spacing[6],
  },

  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing[4],
  },

  helpButtonText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.primary,
    marginLeft: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
  },
});
