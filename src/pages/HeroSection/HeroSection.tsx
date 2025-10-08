import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HERO_SECTION_CONFIG } from '../../config/heroSectionConfig';
import Feature from '../../components/Feature';
import Stat from '../../components/Stat';
import FloatingElement from '../../components/FloatingElement';
import IconTextBtnPrimary from '../../components/buttons/IconTextBtnPrimary';
import ArrowRightIcon from '../../components/Icons/ArrowRightIcon';

const HeroSection: React.FC = () => {
  const { openSignupModal } = useAuth();

  // CTA Button configurations - declared at top
  const exploreButtonConfig = {
    text: "Explore Restaurants",
    icon: <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />,
    size: 'lg' as const,
    textSize: 'lg' as const,
    variant: 'primary' as const,
    className: 'group'
  };

  const joinButtonConfig = {
    text: "Join SERA",
    onClick: openSignupModal,
    size: 'lg' as const,
    textSize: 'lg' as const,
    variant: 'secondary' as const
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 ${HERO_SECTION_CONFIG.background.gradient}`}></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${HERO_SECTION_CONFIG.background.image}')`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
              <span className="text-gradient">{HERO_SECTION_CONFIG.content.title.main}</span>
              <br />
              <span className="text-white">{HERO_SECTION_CONFIG.content.title.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {HERO_SECTION_CONFIG.content.description}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
            {HERO_SECTION_CONFIG.features.map((feature, index) => (
              <Feature key={index} icon={feature.icon} text={feature.text} />
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/explore" className="group">
              <IconTextBtnPrimary {...exploreButtonConfig} />
            </Link>
            <IconTextBtnPrimary {...joinButtonConfig} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
            {HERO_SECTION_CONFIG.stats.map((stat, index) => (
              <Stat key={index} value={stat.value} label={stat.label} color={stat.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {HERO_SECTION_CONFIG.floatingElements.map((element, index) => (
          <FloatingElement
            key={index}
            emoji={element.emoji}
            position={element.position}
            size={element.size}
            bgColor={element.bgColor}
            animationDelay={element.animationDelay}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;