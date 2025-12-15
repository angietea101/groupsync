// Team.jsx
import { motion } from 'framer-motion';
import './Team.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import GithubIcon from '../assets/github-icon.svg';
import FirebaseIcon from '../assets/firebase-icon.svg';
import FigmaIcon from '../assets/figma-icon.svg';
import ReactIcon from '../assets/react-icon.svg';
import OracleIcon from '../assets/oracle-icon.svg';

export default function Team() {
  const teamMembers = [
    {
      name: 'Diego Cid',
      role: 'UI Designer & Fullstack Developer',
      description:
        'Designs the UI for different screens in Figma and implements front-end components using React.',
      color: 'var(--color-primary)',
      initials: 'DC',
    },
    {
      name: 'Angie Tran',
      role: 'Project Manager & Fullstack Developer',
      description:
        'Oversees project timeline, manages team collaboration, and implements front-end components using React.',
      color: 'var(--color-primary)',
      initials: 'AT',
    },
    {
      name: 'Sonia Masih',
      role: 'Documentation Lead & UX Researcher Helper',
      description:
        'Focuses on interpreting gathered data, the writing portion, assists the project manager and collaborates with UX researcher.',
      color: 'var(--color-primary)',
      initials: 'SM',
    },
    {
      name: 'Ruben Bautista',
      role: 'Documentation Lead & UX Researcher',
      description:
        'Focuses on interpreting gathered data, the writing portion, assists the project manager and collaborates with UX researcher.',
      color: 'var(--color-primary)',
      initials: 'RB',
    },
  ];

  const tools = [
    { name: 'Figma', icon: FigmaIcon, description: 'UI/UX Design' },
    { name: 'React', icon: ReactIcon, description: 'Web Development' },
    { name: 'Firebase', icon: FirebaseIcon, description: 'Data Storage' },
    { name: 'GitHub', icon: GithubIcon, description: 'Version Control' },
    { name: 'Oracle', icon: OracleIcon, description: 'Hosting Provider' },
  ];

  const milestones = [
    {
      title: 'Interactive Wireframing',
      description: 'Created and refined wireframes and visual designs for project foundation',
    },
    {
      title: 'Design Exploration',
      description: 'Developed layout structure, key screens, and design rationale',
    },
    {
      title: 'Prototype Development',
      description: 'Built functional interactive prototype based on finalized wireframe design',
    },
    {
      title: 'Usability Testing',
      description:
        'Evaluated usability through structured user testing and applied feedback-driven iteration',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="about-container">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet the <span className="text-primary">GroupSync</span> Team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A dedicated team of designers, developers, and researchers working together to make group
          planning effortless
        </motion.p>
      </motion.section>

      {/* Team Section */}
      <section className="about-team-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Team
        </motion.h2>
        <motion.div
          className="team-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team-card hover-lift"
              variants={cardVariants}
              whileHover={{ y: -8 }}
            >
              <div className="member-avatar" style={{ backgroundColor: member.color }}>
                {member.initials}
              </div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-description">{member.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Tools Section */}
      <section className="about-tools-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Technology Stack
        </motion.h2>
        <motion.p
          className="tools-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Modern tools and frameworks powering GroupSync
        </motion.p>
        <motion.div
          className="tools-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {tools.map((tool, index) => (
            <motion.div
              key={index}
              className="tool-card hover-lift"
              variants={cardVariants}
              whileHover={{ y: -8 }}
            >
              <div className="tool-icon-container">
                <img src={tool.icon} alt={`${tool.name} icon`} className="tool-icon" />
              </div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Project Journey Section */}
      <section className="about-journey-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Project Journey
        </motion.h2>
        <motion.p
          className="journey-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From concept to completion through structured UX/UI design assignments
        </motion.p>
        <motion.div
          className="milestones-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="milestone-card hover-lift"
              variants={itemVariants}
              whileHover={{ x: 8 }}
            >
              <div className="milestone-number">{index + 1}</div>
              <div className="milestone-content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
