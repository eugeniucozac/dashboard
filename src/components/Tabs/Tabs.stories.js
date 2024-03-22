import React from 'react';
import { Tabs } from 'components';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';
import { Box, Typography } from '@material-ui/core';

export default {
  title: 'Tabs',
  component: Tabs,
  decorators: [withKnobs],
};

export const Default = () => {
  const num = number('Tabs', 3, { range: true, min: 1, max: 9, step: 1 });
  const light = boolean('Light', false);
  const compact = boolean('Compact', false);
  const swipeable = boolean('Swipeable', false);
  const disabled = boolean('Disable (tab 2)', false);
  const errors = boolean('Errors (tab 1)', false);

  return (
    <Box width={1}>
      <Tabs
        tabs={[
          { value: '1', label: 'A New Hope', errors: errors ? 1 : 0 },
          { value: '2', label: 'The Empire Strikes Back', disabled },
          { value: '3', label: 'The Return of the Jedi' },
          { value: '4', label: 'The Phantom Menace' },
          { value: '5', label: 'The Attack of the Clones' },
          { value: '6', label: 'Revenge of the Sith' },
          { value: '7', label: 'The Force Awakens' },
          { value: '8', label: 'The Last Jedi' },
          { value: '9', label: 'The Rise of Skywalker' },
        ].filter((t, index) => index < num)}
        light={light}
        compact={compact}
        swipeable={swipeable}
      >
        <Box value="1" py={2}>
          <Typography>
            The galaxy is in a period of civil war. Rebel spies have stolen plans to the Galactic Empire's Death Star, a moon-sized space
            station capable of destroying an entire planet. Princess Leia, secretly one of the Rebellion's leaders, has obtained its
            schematics, but her starship is intercepted by an Imperial Star Destroyer under the command of the ruthless Sith Lord Darth
            Vader, an agent to the Empire. Before she is captured, Leia hides the plans in the memory of astromech droid R2-D2, who, along
            with protocol droid C-3PO, flees in an escape pod to the desert planet Tatooine.
          </Typography>
        </Box>
        <Box value="2" py={2}>
          <Typography>
            Three years after the destruction of the Death Star,[b] the Rebel Alliance, led by Princess Leia, has set up a new base on the
            ice planet Hoth. The Imperial fleet, led by a merciless Darth Vader, hunts for the new Rebel base by dispatching probe droids
            across the galaxy. Luke Skywalker is captured by a wampa while investigating one such probe, but manages to escape from its lair
            using the Force and his lightsaber. Before Luke succumbs to hypothermia, the Force spirit of his deceased mentor, Obi-Wan
            Kenobi, instructs him to go to the swamp planet Dagobah to train under Jedi Master Yoda. Han Solo discovers Luke and manages to
            keep him alive by keeping him under the body fat of his dead Tauntaun mount, and the two are rescued by a search party the
            following morning.
          </Typography>
        </Box>
        <Box value="3" py={2}>
          <Typography>
            C-3PO and R2-D2 are sent to crime lord Jabba the Hutt's palace on Tatooine in a trade bargain made by Luke Skywalker to rescue
            Han Solo. Disguised as a bounty hunter, Princess Leia infiltrates the palace under the pretense of collecting the bounty on
            Chewbacca and unfreezes Han, but is caught and enslaved. Luke soon arrives to bargain for his friends' release, but Jabba drops
            him through a trapdoor to be executed by a rancor. After Luke kills the rancor, Jabba sentences him, Han, and Chewbacca to death
            by being fed to the Sarlacc, a huge, carnivorous plant-like desert beast. Having hidden his new lightsaber inside R2-D2, Luke
            frees himself and battles Jabba's guards while Leia uses her chains to strangle Jabba to death. As the others rendezvous with
            the Rebel Alliance, Luke returns to Dagobah to complete his training with Yoda, whom he finds is dying. Yoda confirms that Darth
            Vader, once known as Anakin Skywalker, is Luke's father, and becomes one with the Force. The Force ghost of Obi-Wan Kenobi
            reveals that Leia is Luke's twin sister, and tells Luke that he must face Vader again to finish his training and defeat the
            Empire.
          </Typography>
        </Box>
        <Box value="4" py={2}>
          <Typography>
            The Trade Federation upsets order in the Galactic Republic by blockading the planet Naboo in preparation for a full-scale
            invasion. The Republic's leader, Supreme Chancellor Finis Valorum, dispatches Jedi Master Qui-Gon Jinn and his apprentice,
            Obi-Wan Kenobi, to negotiate with Trade Federation Viceroy Nute Gunray. Darth Sidious, a Sith Lord and the Trade Federation's
            secret benefactor, orders the Viceroy to kill the Jedi and begin their invasion with an army of battle droids. The Jedi escape
            and flee to Naboo. During the invasion, Qui-Gon saves the life of a Gungan outcast, Jar Jar Binks, from being run over by a
            droid transport. Indebted to Qui-Gon, Jar Jar leads the Jedi to Otoh Gunga, an underwater city of Naboo. The Jedi try to
            persuade the Gungan leader, Boss Nass, to help the planet's surface dwellers but are unsuccessful. However, the Jedi manage to
            obtain Jar Jar's guidance and underwater transport to Theed, the capital city of Naboo. They rescue Naboo's queen, Padmé
            Amidala, and escape from the blockaded planet on her Royal Starship, intending to reach the Republic capital planet of
            Coruscant.
          </Typography>
        </Box>
        <Box value="5" py={2}>
          <Typography>
            The Galactic Republic is threatened by a Separatist movement organized by former Jedi Master Count Dooku. Senator Padmé Amidala
            comes to Coruscant to vote on a motion to create an army to assist the Jedi against the threat. Narrowly avoiding an
            assassination attempt upon her arrival, she is placed under the protection of Jedi Knight Obi-Wan Kenobi and his apprentice
            Anakin Skywalker. The two Jedi thwart a second attempt on her life and subdue the assassin, Zam Wesell, who is killed by her
            employer, a bounty hunter, before revealing his identity. The Jedi Council instructs Obi-Wan to find the bounty hunter, while
            Anakin is tasked to protect Padmé and escort her back to Naboo, where he expresses his romantic feelings for her.
          </Typography>
        </Box>
        <Box value="6" py={2}>
          <Typography>
            Obi-Wan Kenobi and Anakin Skywalker lead a mission to rescue the kidnapped Supreme Chancellor Palpatine from the cyborg
            Separatist commander General Grievous. After infiltrating Grievous' flagship, the Jedi battle Count Dooku, whom Anakin
            overpowers and decapitates at Palpatine's urging. Grievous escapes the battle-torn ship, which the Jedi crash-land on Coruscant.
            There, Anakin reunites with his wife, Padmé Amidala, who reveals that she is pregnant. While initially excited, Anakin soon
            begins to have nightmares about Padmé dying in childbirth.
          </Typography>
        </Box>
        <Box value="7" py={2}>
          <Typography>
            Thirty years after the Galactic Civil War, the First Order has risen from the fallen Galactic Empire and seeks to eliminate the
            New Republic. The Resistance, backed by the Republic and led by General Leia Organa, opposes the First Order. Leia searches for
            her brother, Luke Skywalker, who has gone missing.
          </Typography>
        </Box>
        <Box value="8" py={2}>
          <Typography>
            Shortly after the destruction of Starkiller Base, General Leia Organa leads the evacuation of Resistance forces when a First
            Order fleet arrives. Against Leia's orders, Poe Dameron leads a costly counterattack that destroys a First Order dreadnought.
            The remaining Resistance escapes into hyperspace, but the First Order uses a device to track them, and attacks again. Kylo Ren
            hesitates to fire on the lead Resistance ship after sensing his mother Leia's presence on board, but his wingmen destroy the
            bridge, killing most of the Resistance's leaders. Leia is dragged into space, but survives by using the Force. While Leia
            recovers, Vice Admiral Holdo assumes command of the Resistance. Running low on fuel, the remaining fleet is pursued by the First
            Order.
          </Typography>
        </Box>
        <Box value="9" py={2}>
          <Typography>
            Following a threat of revenge by the revived Emperor Palpatine, Kylo Ren obtains a Sith wayfinder, leading him to the uncharted
            planet Exegol. There, he finds Palpatine, who reveals that he created Snoke as a puppet to control the First Order and lure Kylo
            to the dark side. Palpatine unveils the Final Order—a secret armada of Star Destroyers—and tells Kylo to find and kill Rey, who
            is continuing her Jedi training under Resistance leader Leia Organa. Finn and Poe Dameron deliver intelligence from a spy that
            Palpatine is on Exegol; Rey has learned from Luke Skywalker's notes that a Sith wayfinder can lead them there. Rey, Finn, Poe,
            Chewbacca, BB-8, and C-3PO depart in the Millennium Falcon to Pasaana, where a clue to a wayfinder is hidden.
          </Typography>
        </Box>
      </Tabs>
    </Box>
  );
};
