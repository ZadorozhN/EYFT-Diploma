package com.eyft.server.testdata;

import com.eyft.server.model.*;
import com.eyft.server.testdata.creator.HeroCreator;
import com.google.common.collect.Lists;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;

import java.util.concurrent.atomic.AtomicBoolean;

@Slf4j
@RequiredArgsConstructor
public class DataFillerListener implements ApplicationListener<DataFillingStartEvent> {

    private final AtomicBoolean isInitialized = new AtomicBoolean(false);

    private final HeroCreator heroCreator;

    @Override
    public void onApplicationEvent(DataFillingStartEvent event) {
        if (isInitialized.compareAndSet(false, true)) {
            heroCreator.createCategory("Orthanc", "A tower of Isengard. Built by dunedain");
            heroCreator.createCategory("Isengard", "A place in the south of the Misty Mountains");
            heroCreator.createCategory("Mess", "There going to be fighting");
            heroCreator.createCategory("Magic", "Who doesn't like magic?");
            heroCreator.createCategory("Job", "Job is going to be presented");
            heroCreator.createCategory("Gnomes", "Have you ever seen how small they are?");

            heroCreator.createHero("Frodo", "123", "FrodoBaggins@shire.com", "Frodo", "Baggins", "FrodoBagginsAvatar.jpeg", Role.USER);
            heroCreator.createHero("Bilbo", "123", "BilboBaggins@shire.org", "Bilbo", "Baggins", "BilboBagginsAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Elrond", "123", "Elrond@rivendell.org", "Elrond", "The Wise", "ElrondAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Saruman", "123", "Saruman@orthanc.com", "Saruman", "The White", "SarumanAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Gandalf", "123", "Gandalf@shire.com", "Gandalf", "The Gray", "GandalfAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Tom", "123", "TomBombadil@shire.com", "Tom", "Bombadil", "TomBombadilAvatar.jpeg", Role.USER);
            heroCreator.createHero("Sauron", "123", "Sauron@shire.com", "Sauron", "   ", "SauronAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Balrog", "123", "Balrog@moria.com", "Balrog", "   ", "BalrogAvatar.jpg", Role.ARRANGER);
            heroCreator.createHero("Samwise", "123", "SamwiseGamgee@shire.com", "Samwise", "Gamgee", "SamwiseGamgeeAvatar.jpg", Role.USER);
            heroCreator.createHero("Gollum", "123", "Gollum@shire.com", "Smeagol", "   ", "GollumAvatar.jpg", Role.ARRANGER);

            heroCreator.createEvent("Bilbo", "Bilbo Baggins' Birthday", "Dear Bilbo Baggins gets his 111th birthday and he suggests you to get together with his party!", "Hobbiton, Shire", Lists.newArrayList("Birthday", "Party", "Fireworks"), 1, 2, "BirthdayPreview.jpg", 0);
            heroCreator.createEvent("Elrond", "Many Meetings", "The fellowship of the Ring is gathering here", "Rivendell, Misty Mountains", Lists.newArrayList("Ring", "Elves", "Mountains"), 30, 31, "ManyMeetingsPreview.jpg", 999);
            heroCreator.createEvent("Saruman", "Orthanc Mess", "Saruman is waiting for you, Gandlalf The Gray...", "Orthanc, Isengard", Lists.newArrayList("Tower", "Orthanc", "Isengard", "Magic", "Mess"), 10, 13, "OrthancMeeting.jpg", 9999);
            heroCreator.createEvent("Saruman", "Meeting with Radagast", "Saruman wants to tell Radagast something.", "Orthanc, Isengard", Lists.newArrayList("Tower", "Orthanc", "Isengard"), 3, 5, "RadagastMeeting.jpg", 399);
            heroCreator.createEvent("Gandalf", "A rogue job for Bilbo", "Bilbo is the best rogue in the Shire, isn't he?", "Hobbiton, Shire", Lists.newArrayList("Hobbiton", "Shire", "Job", "Gnomes"), 60, 61, "GandalfAndBilboMeeting.jpg", 0);
            heroCreator.createEvent("Balrog", "Khazad-dûm", "You shall not pass!", "Moria, Khazad-dûm Bridge", Lists.newArrayList("Khazad-dum", "Balrog", "Goblins"), 90, 95, "YouShallNotPass.jpg", 79999);
            heroCreator.createEvent("Gollum", "Orodruin dance", "It's over", "Mordor, Orodruin", Lists.newArrayList("Mordor", "Oroduin", "Ring"), 180, 182, "OrodruinDance.jpg", 99999);

            heroCreator.createProp("The Ring", "The one to rule them all", 100000L, CostType.PIECE, PropType.THING);
            heroCreator.createProp("Elvish Bread", "You will be full of power after a piece of it", 499L, CostType.PIECE, PropType.THING);
            heroCreator.createProp("Rivendell Hall", "A legendary place surrounded by elves", 150000L, CostType.DAY, PropType.PLACE);
            heroCreator.createProp("Elvish Sword", "Shines like the moon", 10000L, CostType.PIECE, PropType.THING);

            heroCreator.createPropOrder("master", "Elvish Bread", 1L, null);
            heroCreator.createPropOrder("master", "Elvish Bread", 10L, null);
            heroCreator.createPropOrder("master", "Elvish Bread", 100L, null);
            heroCreator.createPropOrder("master", "Elvish Bread", 1000L, null);
            heroCreator.createPropOrder("master", "The Ring", 1L, null);
            heroCreator.createPropOrder("master", "The Ring", 1L, null);
            heroCreator.createPropOrder("master", "The Ring", 1L, null);
            heroCreator.createPropOrder("master", "The Ring", 1L, null);

            heroCreator.sendMoney("Frodo", 1000000L);
            heroCreator.sendMoney("Bilbo", 1000000L);
            heroCreator.sendMoney("Saruman", 1000000L);
            heroCreator.sendMoney("Gandalf", 1000000L);
            heroCreator.sendMoney("Elrond", 1000000L);
            heroCreator.sendMoney("master", 1000000L);
        }
    }
}