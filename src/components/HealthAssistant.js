import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Styled Components
const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary[600]} 0%, 
    ${({ theme }) => theme.colors.primary[700]} 50%, 
    ${({ theme }) => theme.colors.primary[800]} 100%
  );
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    color: white;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: static;
    margin-bottom: 2rem;
    align-self: flex-start;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  color: white;
  z-index: 1;
  max-width: 800px;
  padding: 2rem;
`;

const SmartBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  line-height: 1.7;
  max-width: 700px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 2rem 1rem;
  }
`;

const StatsSection = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 5rem;
  margin-top: -3rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: -2rem;
  }
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 2rem;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, ${({ theme }) => theme.colors.primary[50]}, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    
    &::before {
      opacity: 1;
    }
  }
`;

const StatIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  margin: 0 auto 1.5rem;
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const StatTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const AssessmentGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const AssessmentCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 2rem;
  padding: 3rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  min-height: 450px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, transparent, ${({ theme }) => theme.colors.primary[50]}, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 2rem;
    min-height: auto;
  }
`;

const AssessmentIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px ${({ theme }) => theme.colors.primary[200]};

  ${AssessmentCard}:hover & {
    transform: scale(1.1);
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const AssessmentTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 1rem;
`;

const KeyFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const FeatureBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  border: none;
  
  &.success {
    background: ${({ theme }) => theme.colors.success[500]};
  }
  
  &.danger {
    background: ${({ theme }) => theme.colors.danger[500]};
  }
  
  &.info {
    background: ${({ theme }) => theme.colors.info[500]};
  }
  
  &.warning {
    background: ${({ theme }) => theme.colors.warning[500]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const AssessmentDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
`;

const AssessmentArrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;

  ${AssessmentCard}:hover & {
    transform: translateX(8px);
  }
`;

// Assessment Data
const assessmentTypes = [
  {
    id: 'symptom-checker',
    icon: '🩺',
    title: 'AI Symptom Checker',
    description: 'Advanced symptom analysis with AI-powered medical guidance. Get instant insights and recommendations for your health concerns.',
    features: [
      { text: '95% Accurate', type: 'success' },
      { text: 'Instant Results', type: 'info' }
    ]
  },
  {
    id: 'diet-planner',
    icon: '🍽️',
    title: 'Smart Diet Planner',
    description: 'Personalized nutrition plans and meal recommendations based on your health goals and dietary preferences.',
    features: [
      { text: 'Personalized', type: 'success' },
      { text: 'Nutritionist Approved', type: 'warning' }
    ]
  },
  {
    id: 'mental-health',
    icon: '🧠',
    title: 'Mental Health Support',
    description: 'Access mental wellness support, stress management tools, and emotional health guidance with AI-powered recommendations.',
    features: [
      { text: 'Evidence-Based', type: 'info' },
      { text: 'Confidential', type: 'success' }
    ]
  },
  {
    id: 'fitness-coach',
    icon: '💪',
    title: 'AI Fitness Coach',
    description: 'Personalized workout plans and expert fitness guidance tailored to your goals and health conditions.',
    features: [
      { text: 'Real-time', type: 'danger' },
      { text: 'Adaptive', type: 'success' }
    ]
  },
  {
    id: 'sleep-analyzer',
    icon: '😴',
    title: 'Sleep Quality Analyzer',
    description: 'Comprehensive sleep analysis with personalized recommendations to improve your sleep quality and rest patterns.',
    features: [
      { text: 'Deep Analysis', type: 'info' },
      { text: 'Sleep Optimization', type: 'success' }
    ]
  },
  {
    id: 'medicine-advisor',
    icon: '💊',
    title: 'Medicine Advisor',
    description: 'Expert guidance about medications, drug interactions, proper usage, and side effects with AI-powered safety checks.',
    features: [
      { text: 'Safety Checks', type: 'danger' },
      { text: 'Drug Interactions', type: 'warning' }
    ]
  }
];

const stats = [
  { icon: '📈', title: '95% Accuracy Rate' },
  { icon: '⏰', title: '24/7 Available' },
  { icon: '👥', title: '25k+ Users Helped' },
  { icon: '🏥', title: '15+ AI Specialties' }
];

const HealthAssistant = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <HeroSection>
        <BackButton to="/">
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </BackButton>

        <HeroContent>
          <SmartBadge>
            <i className="fas fa-robot"></i>
            Smart AI Health System
          </SmartBadge>
          
          <HeroTitle>Your AI Health Hub</HeroTitle>
          
          <HeroSubtitle>
            Get comprehensive health analysis with visual insights and professional reports. 
            Advanced AI assessment with 25+ detailed questions and interactive charts.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <Container>
        <StatsSection>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <StatIcon>{stat.icon}</StatIcon>
              <StatTitle>{stat.title}</StatTitle>
            </StatCard>
          ))}
        </StatsSection>

        <AssessmentGrid
          as={motion.section}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {assessmentTypes.map((assessment, index) => (
            <AssessmentCard
              key={assessment.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = `/assessment/${assessment.id}`}
            >
              <AssessmentIcon>{assessment.icon}</AssessmentIcon>
              
              <AssessmentTitle>{assessment.title}</AssessmentTitle>
              
              <KeyFeatures>
                {assessment.features.map((feature, featureIndex) => (
                  <FeatureBadge key={featureIndex} className={feature.type}>
                    {feature.text}
                  </FeatureBadge>
                ))}
              </KeyFeatures>
              
              <AssessmentDescription>
                {assessment.description}
              </AssessmentDescription>
              
              <AssessmentArrow>
                Start Assessment <i className="fas fa-arrow-right"></i>
              </AssessmentArrow>
            </AssessmentCard>
          ))}
        </AssessmentGrid>
      </Container>
    </>
  );
};

export default HealthAssistant; 