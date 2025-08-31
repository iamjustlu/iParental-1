import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import { Task, TaskCategory, TaskPriority } from '@/types';

interface TaskWithChild extends Task {
  childName: string;
}

export const TasksScreen: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithChild[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const { childProfiles } = useAuthStore();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    // Mock data
    const mockTasks: TaskWithChild[] = [
      {
        id: '1',
        childId: childProfiles[0]?.id || '1',
        childName: childProfiles[0]?.name || 'Emma',
        title: 'Complete Math Homework',
        description: 'Finish pages 15-20 in math workbook',
        category: TaskCategory.HOMEWORK,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        isCompleted: false,
        isRecurring: false,
        priority: TaskPriority.HIGH,
        pointsReward: 50,
        timeReward: 30,
        verificationRequired: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        childId: childProfiles[0]?.id || '1',
        childName: childProfiles[0]?.name || 'Emma',
        title: 'Clean Your Room',
        description: 'Make bed, organize toys, vacuum floor',
        category: TaskCategory.CHORES,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isCompleted: true,
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRecurring: true,
        recurrencePattern: {
          type: 'weekly',
          interval: 1,
          daysOfWeek: [0, 6], // Sunday and Saturday
        },
        priority: TaskPriority.MEDIUM,
        pointsReward: 30,
        timeReward: 20,
        verificationRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        childId: childProfiles[1]?.id || '2',
        childName: childProfiles[1]?.name || 'Alex',
        title: 'Practice Piano',
        description: 'Practice scales and current lesson song for 30 minutes',
        category: TaskCategory.MUSIC_PRACTICE,
        dueDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
        isCompleted: false,
        isRecurring: true,
        recurrencePattern: {
          type: 'daily',
          interval: 1,
          daysOfWeek: [1, 2, 3, 4, 5], // Weekdays
        },
        priority: TaskPriority.MEDIUM,
        pointsReward: 40,
        timeReward: 25,
        verificationRequired: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setTasks(mockTasks);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.isCompleted);
      case 'completed':
        return tasks.filter(task => task.isCompleted);
      default:
        return tasks;
    }
  };

  const getCategoryIcon = (category: TaskCategory): string => {
    switch (category) {
      case TaskCategory.HOMEWORK:
        return 'book-outline';
      case TaskCategory.CHORES:
        return 'home-outline';
      case TaskCategory.EXERCISE:
        return 'fitness-outline';
      case TaskCategory.READING:
        return 'library-outline';
      case TaskCategory.MUSIC_PRACTICE:
        return 'musical-notes-outline';
      default:
        return 'checkmark-circle-outline';
    }
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.URGENT:
        return theme.colors.status.error;
      case TaskPriority.HIGH:
        return theme.colors.status.warning;
      case TaskPriority.MEDIUM:
        return theme.colors.secondary;
      case TaskPriority.LOW:
        return theme.colors.status.success;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const handleTaskComplete = (taskId: string) => {
    Alert.alert(
      'Mark Complete',
      'Mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            setTasks(prev =>
              prev.map(task =>
                task.id === taskId
                  ? { ...task, isCompleted: true, completedAt: new Date() }
                  : task
              )
            );
          },
        },
      ]
    );
  };

  const renderTask = ({ item }: { item: TaskWithChild }) => (
    <TouchableOpacity style={styles.taskCard} activeOpacity={0.8}>
      <View style={styles.taskHeader}>
        <View style={styles.taskIcon}>
          <Icon
            name={getCategoryIcon(item.category)}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        
        <View style={styles.taskInfo}>
          <Text style={[
            styles.taskTitle,
            item.isCompleted && styles.completedTask,
          ]}>
            {item.title}
          </Text>
          <Text style={styles.taskChild}>{item.childName}</Text>
        </View>

        <View style={styles.taskActions}>
          <View style={[
            styles.priorityDot,
            { backgroundColor: getPriorityColor(item.priority) },
          ]} />
          {!item.isCompleted && (
            <TouchableOpacity
              onPress={() => handleTaskComplete(item.id)}
              style={styles.completeButton}
            >
              <Icon name="checkmark-outline" size={20} color={theme.colors.status.success} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item.description && (
        <Text style={styles.taskDescription}>{item.description}</Text>
      )}

      <View style={styles.taskFooter}>
        <View style={styles.taskRewards}>
          <View style={styles.reward}>
            <Icon name="star-outline" size={16} color={theme.colors.status.warning} />
            <Text style={styles.rewardText}>{item.pointsReward} pts</Text>
          </View>
          {item.timeReward && (
            <View style={styles.reward}>
              <Icon name="time-outline" size={16} color={theme.colors.secondary} />
              <Text style={styles.rewardText}>+{item.timeReward}m</Text>
            </View>
          )}
        </View>

        <Text style={styles.dueDate}>
          Due: {item.dueDate.toLocaleDateString()}
        </Text>
      </View>

      {item.isCompleted && (
        <View style={styles.completedBanner}>
          <Icon name="checkmark-circle" size={16} color={theme.colors.status.success} />
          <Text style={styles.completedText}>
            Completed {item.completedAt?.toLocaleDateString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (childProfiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Icon name="person-add-outline" size={64} color={theme.colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No Children Added</Text>
        <Text style={styles.emptySubtitle}>
          Add a child profile to start assigning tasks
        </Text>
      </View>
    );
  }

  const filteredTasks = getFilteredTasks();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => Alert.alert('Add Task', 'Feature coming soon!')}
        >
          <Icon name="add-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'pending', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              filter === tab && styles.activeFilterTab,
            ]}
            onPress={() => setFilter(tab as any)}
          >
            <Text style={[
              styles.filterTabText,
              filter === tab && styles.activeFilterTabText,
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {tasks.filter(t => !t.isCompleted).length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {tasks.filter(t => t.isCompleted).length}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {tasks.reduce((sum, t) => sum + (t.isCompleted ? t.pointsReward : 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Points Earned</Text>
        </View>
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyTasks}>
            <Icon name="checkmark-done-outline" size={48} color={theme.colors.text.tertiary} />
            <Text style={styles.emptyTasksText}>No {filter} tasks</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing[6],
  },

  emptyTitle: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },

  emptySubtitle: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[6],
    paddingBottom: theme.spacing[4],
  },

  title: {
    fontSize: theme.typography.fontSizes['2xl'],
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  addButton: {
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent.primary,
  },

  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },

  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.background.tertiary,
    marginRight: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },

  activeFilterTab: {
    backgroundColor: theme.colors.primary,
  },

  filterTabText: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.text.secondary,
  },

  activeFilterTabText: {
    color: theme.colors.text.primary,
  },

  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
  },

  statItem: {
    flex: 1,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginRight: theme.spacing[2],
  },

  statNumber: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },

  statLabel: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
  },

  tasksList: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },

  taskCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[3],
    ...theme.shadows.md,
  },

  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },

  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  },

  taskInfo: {
    flex: 1,
  },

  taskTitle: {
    fontSize: theme.typography.fontSizes.base,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },

  completedTask: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.tertiary,
  },

  taskChild: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
  },

  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing[2],
  },

  completeButton: {
    padding: theme.spacing[1],
  },

  taskDescription: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[3],
  },

  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  taskRewards: {
    flexDirection: 'row',
  },

  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },

  rewardText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing[1],
  },

  dueDate: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text.tertiary,
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.transparent.success,
    padding: theme.spacing[2],
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing[3],
  },

  completedText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.status.success,
    marginLeft: theme.spacing[2],
  },

  emptyTasks: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },

  emptyTasksText: {
    fontSize: theme.typography.fontSizes.base,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[3],
  },
});
