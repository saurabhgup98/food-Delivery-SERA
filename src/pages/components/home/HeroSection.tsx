import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts';
import { getHeroButtons, HERO_SECTION_CONFIG } from '../../config/HomePageConfig';
import LocationIcon from '../../../components/Icon/LocationIcon';
import { ItemContainer } from '../../../components/common';
import { PrimaryCenteredActionBtn } from '../../../components/buttons';
import VerticalDetailsTextCard from '../../../components/common/VerticalDetailsTextCard';
import FloatingElement from './FloatingElement';
import { ArrowRightIcon } from '../../../components/Icon/Arrows';
import HeartIcon from '../../../components/Icon/HeartIcon';
import ClockIcon from '../../../components/Icon/ClockIcon';
import { PrimaryActionBtnR } from '../../../components/ui/PrimaryActionBtn';

const HeroSection: React.FC = () => {
  const { openSignupModal } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0">
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
            {HERO_SECTION_CONFIG.features.map((feature, index) => {
              // Map icon string to icon component
              const getIcon = () => {
                switch (feature.icon) {
                  case 'clock':
                    return <ClockIcon className="w-5 h-5 text-sera-yellow" />;
                  case 'heart':
                    return <HeartIcon className="w-5 h-5" color="pink-400" />;
                  case 'location':
                    return <LocationIcon className="w-5 h-5 text-blue-400" size="sm" />;
                  default:
                    return <ClockIcon className="w-5 h-5 text-sera-yellow" />;
                }
              };

              return (
                <ItemContainer
                  key={index}
                  left={{
                    content: getIcon()
                  }}
                  center={{
                    content: <span className="text-white/80">{feature.text}</span>
                  }}
                  right={null}
                  bgColor=""
                  border="border-none"
                  shadow=""
                  shape="rectangle"
                  size=""
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                />
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {getHeroButtons(openSignupModal).map(({ to, ...props }, index) =>
              to
                ? <Link key={index} to={to} className="group"><PrimaryActionBtnR {...props} /></Link>
                : <PrimaryActionBtnR key={index} {...props} />
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
            {HERO_SECTION_CONFIG.stats.map((stat, index) => (
              <VerticalDetailsTextCard
                key={index}
                lines={[
                  {
                    text: stat.value,
                    textColor: stat.color,
                    textWeight: "text-4xl md:text-5xl font-bold"
                  },
                  {
                    text: stat.label,
                    textColor: "text-gray-400",
                    textWeight: "text-sm"
                  }
                ]}
              />
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