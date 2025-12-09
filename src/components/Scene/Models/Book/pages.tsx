// components/Scene/Models/Book/pages.tsx
import { atom } from "jotai";
import type { SetStateAction } from "jotai/vanilla";

export interface PageContent {
  front: string
  back: string
  hotspots?: Hotspot[]
}


export interface Hotspot {
  position: [number, number, number]
  size: [number, number, number]
  onClick: (setPage: (update: SetStateAction<number>) => void) => void
  name?: string
  debugColor?: string
  side?: 'front' | 'back'
  targetPage?: number
  toggleContent?: PageContent
  isToggle?: boolean
  actionType?: 'navigate' | 'toggle' | 'link' | 'custom'
}

const hotspotActions = {
  goToPage: (pageNumber: number, setPage: (update: SetStateAction<number>) => void) => {
    // console.log(`Navigating to page ${pageNumber}`)
    setPage(pageNumber)
  },
  
  // openProjects: () => {
  //   console.log(`Opening projects`)
  //   window.open('/projects/index.html')
  // },
  openProjects: (currentPage: number, url?: string) => {
    // console.log(`Opening projects from page ${currentPage}`)
    window.location.href = url ? url + `&fromPage=${currentPage}` : `/projects/index.html?fromPage=${currentPage}`;
  },

  showContactInfo: (setPage: (update: SetStateAction<number>) => void) => {
    setPage(4)
  },
  
  openLink: (url: string) => {
    window.open(url, '_blank')
  },
  
  openVideo: (videoUrl: string, title?: string) => {
    if (window.openVideoModal) {
      window.openVideoModal(videoUrl, title);
    }
  },

  openEmail: (email: string, subject?: string, body?: string) => {
    let mailtoUrl = `mailto:${email}`;
    const params = [];
    
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    
    if (params.length > 0) {
      mailtoUrl += `?${params.join('&')}`;
    }
    
    window.location.href = mailtoUrl;
  },

  openPDF: (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  },

  downloadPDF: (pdfUrl: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // replacePageContent: (
  //   pageIndex: number, 
  //   newContent: { front: string; back: string; hotspots?: Hotspot[] },
  //   setPage: (update: SetStateAction<number>) => void
  // ) => {
  //   // console.log(`Replacing content on page ${pageIndex}`)
  // }
}


const vec3 = (x: number, y: number, z: number): [number, number, number] => [x, y, z]

const hotspot_contents_back = {
  position: vec3(-0.01, -0.81, 0),
  size: vec3(0.035, 0.035, 0.002),
  name: "Go to Page Contents (1)",
  onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(1, setPage),
  debugColor: "red", // "red",
  side: "back" as const,
  isToggle: false,
  actionType: 'link' as const
}

const hotspot_contents_front = {
  position: vec3(0.01, -0.81, 0),
  size: vec3(0.035, 0.035, 0.002),
  name: "Go to Page Contents (1)",
  onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(1, setPage),
  debugColor: "red", // "red",
  side: "front" as const,
  isToggle: false,
  actionType: 'link' as const
}
// components/Scene/Models/Book/pages.tsx
// x, y for front of page
// Lower the number, more to the left, lower more down
const createNotebookPages = () => {
  const pages = [];
    const mainContent = {
        front: "contents_unexpanded",
        back: "plain_1",
        hotspots: [
          {
            position: vec3(-0.365, 0.34, -0.001),
            size: vec3(0.05, 0.05, 0.002),
            name: "Expand Journey",
            onClick: () => {},
            debugColor: "red", // "#ff8800",
            side: "front" as const,
            isToggle: true,
            actionType: 'toggle' as const,
          },
          {
            position: vec3(-0.365, 0.14, 0),
            size: vec3(0.05, 0.05, 0.002),
            name: "Expand Projects",
            onClick: () => {},
            debugColor: "red", // "#00ff00", 
            side: "front" as const,
            isToggle: true,
            actionType: 'toggle' as const
          },
          {
            position: vec3(-0.2, 0.45, 0),
            size: vec3(0.28, 0.05, 0.002),
            name: "Go to Page About me (?)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(2, setPage),
            debugColor: "red", // "#0000ff",
            side: "front" as const,
            actionType: 'navigate' as const,
            targetPage: 3
          },
          {
            position: vec3(-0.17, 0.35, 0),
            size: vec3(0.32, 0.05, 0.002),
            name: "Go to Page My Journey (3)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(3, setPage),
            debugColor: "red", // "red",
            side: "front" as const,
            actionType: 'link' as const
          },
          {
            position: vec3(-0.25, 0.25, 0),
            size: vec3(0.17, 0.05, 0.002),
            name: "Go to Page Skills (7)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(7, setPage),
            debugColor: "red", // "#0000ff",
            side: "front" as const,
            actionType: 'navigate' as const,
            targetPage: 3
          },
          {
            position: vec3(-0.21, 0.14, 0),
            size: vec3(0.23, 0.05, 0.002),
            name: "Go to Page Projects (8)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(8, setPage),
            debugColor: "red", // "red",
            side: "front" as const,
            actionType: 'navigate' as const,
            targetPage: 3
          },
          {
            position: vec3(-0.08, 0.04, 0),
            size: vec3(0.5, 0.05, 0.002),
            name: "Go to Page Beyond the code (14)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(14, setPage),
            debugColor: "red", // "red",
            side: "front" as const,
            actionType: 'link' as const
          },
          {
            position: vec3(-0.21, -0.07, 0),
            size: vec3(0.22, 0.05, 0.002),
            name: "Go to Page Connect (15)",
            onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(15, setPage),
            debugColor: "red", // "red",
            side: "front" as const,
            actionType: 'navigate' as const,
            targetPage: 3
          },
          // {
          //   position: vec3(-0.08, -0.18, 0),
          //   size: vec3(0.5, 0.05, 0.002),
          //   name: "Go to Page Drafts and notes (?)",
          //   onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(1, setPage),
          //   debugColor: "red", // "red",
          //   side: "front" as const,
          //   actionType: 'link'
          // },
          hotspot_contents_back,
        ]
    };

  // Define toggle contents with reference back to main content
  const journeyContent = {
    front: "contents_expanded_journey",
    back: "plain_1",
    hotspots: [
      {
        position: vec3(-0.365, 0.34, -0.001),
        size: vec3(0.05, 0.05, 0.002),
        name: "Back to Main",
        onClick: () => {},
        debugColor: "red", // "#ff8800",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const,
        toggleContent: mainContent
      },
      {
        position: vec3(-0.365, -0.275, 0),
        size: vec3(0.05, 0.05, 0.002),
        name: "Expand Projects",
        onClick: () => {},
        debugColor: "red", // "#00ff00", 
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      {
        position: vec3(-0.2, 0.45, 0),
        size: vec3(0.28, 0.05, 0.002),
        name: "Go to Page About me (2)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(2, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.17, 0.35, 0),
        size: vec3(0.32, 0.05, 0.002),
        name: "Go to Page My Journey (3)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(3, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.25, -0.18, 0),
        size: vec3(0.17, 0.05, 0.002),
        name: "Go to Page Skills (7)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(7, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.21, -0.28, 0),
        size: vec3(0.23, 0.05, 0.002),
        name: "Go to Page Projects (8)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(8, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.08, -0.38, 0),
        size: vec3(0.5, 0.05, 0.002),
        name: "Go to Page Beyond the code (14)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(14, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.21, -0.48, 0),
        size: vec3(0.22, 0.05, 0.002),
        name: "Go to Page Connect (15)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(15, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      // {
      //   position: vec3(-0.08, -0.59, 0),
      //   size: vec3(0.5, 0.05, 0.002),
      //   name: "Go to Page Drafts and notes (?)",
      //   onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(1, setPage),
      //   debugColor: "red", // "red",
      //   side: "front" as const,
      //   actionType: 'link'
      // },
      {
        position: vec3(-0.08, 0.24, 0),
        size: vec3(0.3, 0.05, 0.002),
        name: "Go to Page The Spark (3)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(3, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.05, 0.14, 0),
        size: vec3(0.33, 0.05, 0.002),
        name: "Go to Page The Pursuit (4)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(4, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.07, 0.03, 0),
        size: vec3(0.31, 0.05, 0.002),
        name: "Go to Page The Dream (4)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(4, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.055, -0.06, 0),
        size: vec3(0.34, 0.05, 0.002),
        name: "Go to Page The Present (5)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(5, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      hotspot_contents_back,
    ]
  };

  const projectsContent = {
    front: "contents_expanded_projects", 
    back: "plain_1",
    hotspots: [
      {
        position: vec3(-0.365, 0.14, 0),
        size: vec3(0.05, 0.05, 0.002),
        name: "Back to Main",
        onClick: () => {},
        debugColor: "red", // "#00ff00",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const,
        toggleContent: mainContent
      },
      {
        position: vec3(-0.365, 0.34, -0.001),
        size: vec3(0.05, 0.05, 0.002),
        name: "Expand Journey",
        onClick: () => {},
        debugColor: "red", // "#ff8800",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const,
        // toggleContent: journeyContent
      },
      {
        position: vec3(-0.2, 0.45, 0),
        size: vec3(0.28, 0.05, 0.002),
        name: "Go to Page About me (3)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(2, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.17, 0.35, 0),
        size: vec3(0.32, 0.05, 0.002),
        name: "Go to Page My Journey (3)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(3, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.25, 0.25, 0),
        size: vec3(0.17, 0.05, 0.002),
        name: "Go to Page Skills (7)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(7, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.21, 0.14, 0),
        size: vec3(0.23, 0.05, 0.002),
        name: "Go to Page Projects (8)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(8, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.08, -0.64, 0),
        size: vec3(0.5, 0.05, 0.002),
        name: "Go to Page Beyond the code (14)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(14, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.21, -0.75, 0),
        size: vec3(0.22, 0.05, 0.002),
        name: "Go to Page Connect (15)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(15, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.03, 0.04, 0),
        size: vec3(0.4, 0.05, 0.002),
        name: "Go to Page 42 Highlights (8)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(8, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.03, -0.06, 0),
        size: vec3(0.2, 0.05, 0.002),
        name: "Go to Page fractol (8)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(8, setPage),
        debugColor: "red", // "red",
        side: "front" as const,
        actionType: 'link' as const
      },
      {
        position: vec3(-0.03, -0.12, 0),
        size: vec3(0.2, 0.04, 0.002),
        name: "Go to Page cub3d (9)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(9, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.036, -0.18, 0),
        size: vec3(0.14, 0.03, 0.002),
        name: "Go to Page ft_irc (10)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(10, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(0.08, -0.23, 0),
        size: vec3(0.48, 0.05, 0.002),
        name: "Go to Page ft_transcendence (11)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(11, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(0.048, -0.33, 0),
        size: vec3(0.61, 0.05, 0.002),
        name: "Go to Page independent projects (12)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(12, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(0, -0.44, 0),
        size: vec3(0.32, 0.04, 0.002),
        name: "Go to Page stream_sh (12)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(12, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(0.04, -0.49, 0),
        size: vec3(0.43, 0.04, 0.002),
        name: "Go to Page nutrition agent (12)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(12, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      {
        position: vec3(-0.007, -0.545, 0),
        size: vec3(0.23, 0.04, 0.002),
        name: "Go to Page portfolio (13)",
        onClick: (setPage: (update: SetStateAction<number>) => void) => hotspotActions.goToPage(13, setPage),
        debugColor: "red", // "#0000ff",
        side: "front" as const,
        actionType: 'navigate' as const,
        targetPage: 3
      },
      hotspot_contents_back,
    ]
  };
    (mainContent.hotspots[0] as Hotspot).toggleContent = journeyContent;
    (mainContent.hotspots[1] as Hotspot).toggleContent = projectsContent;
    (projectsContent.hotspots[1] as Hotspot).toggleContent = journeyContent;
    (journeyContent.hotspots[1] as Hotspot).toggleContent = projectsContent;
  // mainContent.hotspots[0].toggleContent = journeyContent;
  // mainContent.hotspots[1].toggleContent = projectsContent;
  // projectsContent.hotspots[1].toggleContent = journeyContent;
  // journeyContent.hotspots[1].toggleContent = projectsContent;

  pages.push({
    front: "cover_6",
    back: "ps_page",
  });
  
  pages.push(mainContent);

  pages.push({
    front: "about_me", 
    back: "journey_the_spark_1",
    hotspots: [
      hotspot_contents_front,
      hotspot_contents_back,
    ]
  });

  pages.push({
    front: "journey_the_spark_2", 
    back: "journey_the_pursuit_1",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  pages.push({
    front: "journey_the_dream_1",
    back: "journey_the_dream_2",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  pages.push({
    front: "journey_the_present_1",
    back: "journey_the_present_2",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  // JOURNEY GALLER START
  const myJourneyGalleryImages = [
    "journey_the_present_3_1",
    "journey_the_present_3_2",
    "journey_the_present_3_3"
  ];

  const myJourneyCreateGalleryContent = (currentIndex: number) => ({
    front: myJourneyGalleryImages[currentIndex],
    back: "plain_11",
    hotspots: [
      // Left arrow
      {
        position: vec3(-0.19, -0.039, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Previous Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      // Right arrow
      {
        position: vec3(0.34, -0.037, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Next Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "pink",
        side: "front" as const, 
        isToggle: true,
        actionType: 'toggle'  as const
      },
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  const myJourneyGalleryContents = myJourneyGalleryImages.map((_: string, index: number) => myJourneyCreateGalleryContent(index));

  myJourneyGalleryContents.forEach((content, index: number) => {
    const prevIndex = index === 0 ? myJourneyGalleryImages.length - 1 : index - 1;
    const nextIndex = index === myJourneyGalleryImages.length - 1 ? 0 : index + 1;
    
    //left arrw
    if (content.hotspots?.[0]) {
      (content.hotspots[0] as Hotspot).toggleContent = myJourneyGalleryContents[prevIndex];
    }
    
    // right arrow
    if (content.hotspots?.[1]) {
      (content.hotspots[1] as Hotspot).toggleContent = myJourneyGalleryContents[nextIndex];
    }
  });

  pages.push(myJourneyGalleryContents[0]);
  // JOURNEY GALLERY END

  // pages.push({
  //   front: "my_journey/the_present_3", 
  //   back: "plain",
  // });

  pages.push({
    front: "skills", 
    back: "projects_1_fractol_main",
    hotspots: [
      {
        position: vec3(0.28, 0.44, 0),
        size: vec3(0.25, 0.04, 0.002),
        name: `Go to projects page`,
        onClick: () => {hotspotActions.openProjects(8)},
        debugColor: "pink",
        side: "back" as const,
      },
      {
        position: vec3(0.25, 0.19, 0),
        size: vec3(0.18, 0.04, 0.002),
        name: `Go to projects/fractal page`,
        onClick: () => {hotspotActions.openProjects(8, "/projects/projects/index.html?name=fractol")},
        debugColor: "pink",
        side: "back" as const,
      },
      {
        position: vec3(0.3, -0.18, 0),
        size: vec3(0.18, 0.04, 0.002),
        name: `Go to projects page`,
        onClick: () => {hotspotActions.openLink("https://en.wikipedia.org/wiki/Fractal")},
        debugColor: "pink",
        side: "back" as const,
      },
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  // FRACTOL GALLERY START
  const fractolGalleryImages = [
    "projects_1_fractol_1",
    "projects_1_fractol_2",
    "projects_1_fractol_3",
    "projects_1_fractol_4",
    "projects_1_fractol_5",
  ];

  const fractolCreateGalleryContent = (currentIndex: number) => ({
    front: fractolGalleryImages[currentIndex],
    back: "projects_2_cub3d_main",
    hotspots: [
      // Left arrow
      {
        position: vec3(-0.3, -0.04, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Previous Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      // Right arrow
      {
        position: vec3(0.45, -0.04, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Next Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "pink",
        side: "front" as const, 
        isToggle: true,
        actionType: 'toggle' as const
      },
      {
        position: vec3(0.25, 0.55, 0),
        size: vec3(0.18, 0.04, 0.002),
        name: `Go to projects/cub3d page`,
        onClick: () => {hotspotActions.openProjects(9, "/projects/projects/index.html?name=cub3d")},
        debugColor: "pink",
        side: "back" as const,
      },
      {
        position: vec3(-0.055, 0.29, 0),
        size: vec3(0.38, 0.04, 0),
        name: `Go to projects page`,
        onClick: () => {hotspotActions.openLink("https://en.wikipedia.org/wiki/Wolfenstein_3D")},
        debugColor: "red",
        side: "back" as const,
      },
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  const fractolGalleryContents = fractolGalleryImages.map((_: string, index: number) => fractolCreateGalleryContent(index));
  fractolGalleryContents.forEach((content, index: number) => {
    const prevIndex = index === 0 ? fractolGalleryImages.length - 1 : index - 1;
    const nextIndex = index === fractolGalleryImages.length - 1 ? 0 : index + 1;

    //left arrw
    if (content.hotspots?.[0]) {
      (content.hotspots[0] as Hotspot).toggleContent = fractolGalleryContents[prevIndex];
    }
    
    // right arrow
    if (content.hotspots?.[1]) {
      (content.hotspots[1] as Hotspot).toggleContent = fractolGalleryContents[nextIndex];
    }
  });

  pages.push(fractolGalleryContents[0]);
  // FRACTOL GALLERY END

  // CUB3D GALLERY START
  const cub3DGalleryImages = [
    "projects_2_cub3d_1",
    "projects_2_cub3d_2",
    "projects_2_cub3d_3",
    "projects_2_cub3d_4",
    "projects_2_cub3d_5",
  ];

  const cub3DCreateGalleryContent = (currentIndex: number) => ({
    front: cub3DGalleryImages[currentIndex],
    back: "projects_3_ft_irc_main",
    hotspots: [
      // Left arrow
      {
        position: vec3(-0.34, 0, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Previous Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      // Right arrow
      {
        position: vec3(0.5, 0, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Next Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "pink",
        side: "front" as const, 
        isToggle: true,
        actionType: 'toggle' as const
      },
      {
        position: vec3(0.26, 0.55, 0),
        size: vec3(0.15, 0.04, 0.002),
        name: `Go to projects/ft_irc page`,
        onClick: () => {hotspotActions.openProjects(10, "/projects/projects/index.html?name=ft_irc")},
        debugColor: "pink",
        side: "back" as const,
      },
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  const cub3DGalleryContents = cub3DGalleryImages.map((_: string, index: number) => cub3DCreateGalleryContent(index));
  cub3DGalleryContents.forEach((content, index: number) => {
    const prevIndex = index === 0 ? cub3DGalleryImages.length - 1 : index - 1;
    const nextIndex = index === cub3DGalleryImages.length - 1 ? 0 : index + 1;

    //left arrw
    if (content.hotspots?.[0]) {
      (content.hotspots[0] as Hotspot).toggleContent = cub3DGalleryContents[prevIndex];
    }
    
    // right arrow
    if (content.hotspots?.[1]) {
      (content.hotspots[1] as Hotspot).toggleContent = cub3DGalleryContents[nextIndex];
    }
  });

  pages.push(cub3DGalleryContents[0]);
  // CUB3D GALLERY END

  // FT_IRC GALLERY START
  const ft_ircGalleryImages = [
    "projects_3_ft_irc_1",
    "projects_3_ft_irc_2",
    "projects_3_ft_irc_3",
    "projects_3_ft_irc_4",
    "projects_3_ft_irc_5",
  ];

  const ft_ircCreateGalleryContent = (currentIndex: number) => ({
    front: ft_ircGalleryImages[currentIndex],
    back: "projects_4_ft_transcendence_main",
    hotspots: [
      // Left arrow
      {
        position: vec3(-0.36, -0.04, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Previous Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      // Right arrow
      {
        position: vec3(0.55, -0.04, 0),
        size: vec3(0.06, 0.06, 0.002),
        name: `Next Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "pink",
        side: "front" as const, 
        isToggle: true,
        actionType: 'toggle' as const
      },
      {
        position: vec3(0.12, 0.55, 0),
        size: vec3(0.42, 0.04, 0.005),
        name: `Go to projects/ft_transcendence page`,
        onClick: () => {hotspotActions.openProjects(11, "/projects/projects/index.html?name=transcendence")},
        debugColor: "pink",
        side: "back" as const,
      },
      {
        position: vec3(-0.15, 0.45, 0),
        size: vec3(0.7, 0.04, 0.005),
        name: `Go to projects/ft_transcendence page`,
        onClick: () => {hotspotActions.openLink("https://transcendence.ngaurama.com")},
        debugColor: "pink",
        side: "back" as const,
      },
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  });

  const ft_ircGalleryContents = ft_ircGalleryImages.map((_: string, index: number) => ft_ircCreateGalleryContent(index));
  ft_ircGalleryContents.forEach((content, index: number) => {
    const prevIndex = index === 0 ? ft_ircGalleryImages.length - 1 : index - 1;
    const nextIndex = index === ft_ircGalleryImages.length - 1 ? 0 : index + 1;

    //left arrw
    if (content.hotspots?.[0]) {
      (content.hotspots[0] as Hotspot).toggleContent = ft_ircGalleryContents[prevIndex];
    }
    
    // right arrow
    if (content.hotspots?.[1]) {
      (content.hotspots[1] as Hotspot).toggleContent = ft_ircGalleryContents[nextIndex];
    }
  });

  pages.push(ft_ircGalleryContents[0]);
  // FT_IRC GALLERY END

  pages.push({
    front: "projects_4_ft_transcendence_main_2",
    back: "projects_1_stream_sh",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
      {
        position: vec3(0, 0.08, 0),
        size: vec3(0.1, 0.04, 0.005),
        name: `Go to projects/ft_transcendence page`,
        onClick: () => {hotspotActions.openProjects(11, "/projects/projects/index.html?name=transcendence")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.21, 0.45, 0),
        size: vec3(0.25, 0.04, 0.005),
        name: `Go to projects/stream_sh page`,
        onClick: () => {hotspotActions.openProjects(12, "/projects/projects/index.html?name=stream_sh")},
        debugColor: "red",
        side: "back" as const,
      },
      {
        position: vec3(-0.05, 0.34, 0),
        size: vec3(0.55, 0.04, 0.005),
        name: `Go to stream_sh site`,
        onClick: () => {hotspotActions.openLink("https://stream.ngaurama.com")},
        debugColor: "red",
        side: "back" as const,
      },
      {
        position: vec3(-0.022, -0.75, 0),
        size: vec3(0.1, 0.04, 0.005),
        name: `Go to projects/stream_sh page`,
        onClick: () => {hotspotActions.openProjects(12, "/projects/projects/index.html?name=stream_sh")},
        debugColor: "red",
        side: "back" as const,
      },
    ]
  });

  pages.push({
    front: "projects_2_nutrition_agent",
    back: "projects_3_portfolio_1",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
      {
        position: vec3(-0.14, 0.55, 0),
        size: vec3(0.38, 0.04, 0.005),
        name: `Go to projects/nutrition_agent page`,
        onClick: () => {hotspotActions.openProjects(12, "/projects/projects/index.html?name=CraftAI-Hackathon")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.1, 0.45, 0),
        size: vec3(0.65, 0.04, 0.005),
        name: `Go to hackathon site page`,
        onClick: () => {hotspotActions.openLink("https://hackathon.ngaurama.com")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(-0.15, -0.55, 0),
        size: vec3(0.3, 0.04, 0.005),
        name: `Go to symphony.fr`,
        onClick: () => {hotspotActions.openLink("https://symphony.fr")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.022, -0.75, 0),
        size: vec3(0.1, 0.04, 0.005),
        name: `Go to projects/hackathon page`,
        onClick: () => {hotspotActions.openProjects(12, "/projects/projects/index.html?name=CraftAI-Hackathon")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.22, 0.55, 0),
        size: vec3(0.2, 0.04, 0.005),
        name: `Go to projects/portfolio page`,
        onClick: () => {hotspotActions.openProjects(13, "/projects/projects/index.html?name=portfolio")},
        debugColor: "red",
        side: "back" as const,
      },
      {
        position: vec3(0, 0.45, 0),
        size: vec3(0.35, 0.04, 0.005),
        name: `Go to main portfolio page`,
        onClick: () => {hotspotActions.openLink("https://ngaurama.com")},
        debugColor: "red",
        side: "back" as const,
      },
      {
        position: vec3(-0.1, -0.18, 0),
        size: vec3(0.08, 0.04, 0.005),
        name: `Go to portfolio prototype`,
        // onClick: () => hotspotActions.openVideo("/demo.mp4", "Project Demo"),
        onClick: () => {hotspotActions.openLink("https://ngaurama.github.io/portfolio_prototype/")},
        debugColor: "red",
        side: "back" as const,
      },
    ]
  });

  pages.push({
    front: "projects_3_portfolio_2",
    back: "beyond_the_code_1",
    hotspots: [
      hotspot_contents_back,
      hotspot_contents_front,
    ]
  })

  // beyond the code GALLERY START
  const beyondTheCodeGalleryImages = [
    "beyond_the_code_2_1",
    "beyond_the_code_2_2",
    "beyond_the_code_2_3",
    "beyond_the_code_2_4",
    "beyond_the_code_2_5",
    "beyond_the_code_2_6",
    "beyond_the_code_2_7",
    "beyond_the_code_2_8",
  ];

  const beyondTheCodeCreateGalleryContent = (currentIndex: number) => {
    const baseHotspots = [
      // Left arrow
      {
        position: vec3(-0.25, -0.04, 0),
        size: vec3(0.03, 0.06, 0.002),
        name: `Previous Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const,
        isToggle: true,
        actionType: 'toggle' as const
      },
      // Right arrow
      {
        position: vec3(0.36, -0.04, 0),
        size: vec3(0.03, 0.06, 0.002),
        name: `Next Image (${currentIndex})`,
        onClick: () => {},
        debugColor: "white",
        side: "front" as const, 
        isToggle: true,
        actionType: 'toggle' as const
      },
      hotspot_contents_back,
      hotspot_contents_front
    ];

    if (currentIndex === 2 || currentIndex === 3 || currentIndex === 4) {
      baseHotspots.push({
        position: vec3(0.028, -0.07, 0),
        size: vec3(0.08, 0.08, 0.002),
        name: `Play Video (${currentIndex})`,
        onClick: () => {
          const videoNumber = currentIndex - 1;
          hotspotActions.openVideo(
            `/videos/optimized/piano_practice_${videoNumber}.webm`, 
            `Piano Practice #${videoNumber}`
          );
        },
        debugColor: "red",
        side: "front" as const,
        isToggle: false,
        actionType: 'toggle' as const
      });
    }

    return {
      front: beyondTheCodeGalleryImages[currentIndex],
      back: "plain_27",
      hotspots: baseHotspots
    };
  };

  const beyondTheCodeGalleryContents = beyondTheCodeGalleryImages.map((_: string, index: number) => beyondTheCodeCreateGalleryContent(index));
  beyondTheCodeGalleryContents.forEach((content, index: number) => {
    const prevIndex = index === 0 ? beyondTheCodeGalleryImages.length - 1 : index - 1;
    const nextIndex = index === beyondTheCodeGalleryImages.length - 1 ? 0 : index + 1;

    //left arrw
    if (content.hotspots?.[0]) {
      (content.hotspots[0] as Hotspot).toggleContent = beyondTheCodeGalleryContents[prevIndex];
    }
    
    // right arrow
    if (content.hotspots?.[1]) {
      (content.hotspots[1] as Hotspot).toggleContent = beyondTheCodeGalleryContents[nextIndex];
    }
  });

  pages.push(beyondTheCodeGalleryContents[0]);
  // beyond the code GALLERY END

  pages.push({
    front: "connect_1",
    back: "back_final",
    hotspots: [
      // hotspot_contents_back,
      hotspot_contents_front,
      {
        position: vec3(0, 0.45, 0),
        size: vec3(0.5, 0.04, 0.005),
        name: `Email connect`,
        onClick: () => {hotspotActions.openEmail("nitai.gauramani.dev@gmail.com")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.15, 0.35, 0),
        size: vec3(0.7, 0.04, 0.005),
        name: `Linkedin connect`,
        onClick: () => {hotspotActions.openLink("https://linkedin.com/in/ngaurama")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.05, 0.24, 0),
        size: vec3(0.55, 0.04, 0.005),
        name: `Github connect`,
        onClick: () => {hotspotActions.openLink("https://github.com/ngaurama")},
        debugColor: "red",
        side: "front" as const,
      },
      {
        position: vec3(0.08, 0.14, 0),
        size: vec3(0.3, 0.04, 0.005),
        name: `Linkedin connect`,
        onClick: () => {hotspotActions.openPDF("/Nitai_CV.pdf")},
        debugColor: "red",
        side: "front" as const,
      },
    ]
  });

  // pages.push({
  //   front: "plain",
  //   back: "back_final",
  // });
  return pages;
  
};

export const pageAtom = atom(0);
export const pages = createNotebookPages();
