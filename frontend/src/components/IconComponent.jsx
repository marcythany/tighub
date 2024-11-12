import React from 'react';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiSwift,
  SiCsharp,
  SiGo,
  SiHtml5,
  SiCss3,
  SiRuby,
  SiPhp,
  SiRust,
  SiKotlin,
  SiDart,
  SiR,
  SiScala,
  SiPerl,
  SiHaskell,
  SiJulia,
  SiLua,
  SiGnubash,
  SiPowershell,
  SiMysql,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

// Tecnologias suportadas pela API do GitHub (linguagens de programação)
export const TECH_ICONS = {
  JavaScript: { icon: SiJavascript, color: '#F7DF1E' },
  TypeScript: { icon: SiTypescript, color: '#3178C6' },
  Python: { icon: SiPython, color: '#3776AB' },
  Java: { icon: FaJava, color: '#007396' },
  'C++': { icon: SiCplusplus, color: '#00599C' },
  Swift: { icon: SiSwift, color: '#FA7343' },
  'C#': { icon: SiCsharp, color: '#239120' },
  Go: { icon: SiGo, color: '#00ADD8' },
  HTML: { icon: SiHtml5, color: '#E34F26' },
  CSS: { icon: SiCss3, color: '#1572B6' },
  Ruby: { icon: SiRuby, color: '#CC342D' },
  PHP: { icon: SiPhp, color: '#777BB4' },
  Rust: { icon: SiRust, color: '#000000' },
  Kotlin: { icon: SiKotlin, color: '#7F52FF' },
  Dart: { icon: SiDart, color: '#0175C2' },
  R: { icon: SiR, color: '#276DC3' },
  Scala: { icon: SiScala, color: '#DC322F' },
  Perl: { icon: SiPerl, color: '#39457E' },
  Haskell: { icon: SiHaskell, color: '#5D4F85' },
  Julia: { icon: SiJulia, color: '#9558B2' },
  Lua: { icon: SiLua, color: '#2C2D72' },
  Shell: { icon: SiGnubash, color: '#4EAA25' },
  PowerShell: { icon: SiPowershell, color: '#5391FE' },
  SQL: { icon: SiMysql, color: '#4479A1' },
};

// Componente para renderizar ícones de tecnologia
const IconComponent = ({
  name,
  size = 24,
  className = '',
  showName = false,
  nameClassName = '',
  containerClassName = '',
}) => {
  const tech = TECH_ICONS[name];

  if (!tech) {
    // Fallback com ícone genérico se a tecnologia não for encontrada
    return (
      <div
        className={`text-gray-500 ${className}`}
        title={`Desconhecido: ${name}`}
      >
        <span className="text-xl">❓</span>{' '}
        {/* Usando o emoji para um ícone genérico */}
      </div>
    );
  }

  const { icon: Icon, color } = tech;

  const iconElement = (
    <Icon
      size={size}
      color={color}
      className={`transition-all duration-300 hover:scale-110 ${className}`}
      title={name}
    />
  );

  if (showName) {
    return (
      <div className={`flex items-center gap-2 ${containerClassName}`}>
        {iconElement}
        <span className={`text-sm ${nameClassName}`}>{name}</span>
      </div>
    );
  }

  return iconElement;
};

// Componente para grupo de ícones
export const IconGroup = ({
  icons = [], // Verificando se é um array válido
  size = 24,
  showNames = false,
  className = '',
  containerClassName = '',
}) => {
  if (!Array.isArray(icons)) {
    console.error('O parâmetro "icons" deve ser um array.');
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-4 ${containerClassName}`}>
      {icons.map((name) => (
        <IconComponent
          key={name}
          name={name}
          size={size}
          showName={showNames}
          className={className}
        />
      ))}
    </div>
  );
};

export default IconComponent;
