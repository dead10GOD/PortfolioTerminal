"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"

interface Command {
  input: string
  output: string[]
}

export default function TerminalPortfolio() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Command[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const currentInputRef = useRef<HTMLDivElement>(null)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dateStr = now.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setCurrentTime(`<span class="text-green-300">${dateStr}</span> <span class="text-white">${timeStr}</span>`)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Focus input on mount and click
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (currentInputRef.current) {
      currentInputRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }, [history, input])

  // Initial welcome message
  useEffect(() => {
    setHistory([
      {
        input: "",
        output: ["Hey there! Howdy ?", "Type 'help' to see available commands", ""],
      },
    ])
  }, [])

  // Add this function after the useEffect hooks and before the commands object
  const getClosestCommand = (input: string): string | null => {
    const availableCommands = [
      "help",
      "h",
      "about",
      "whoami",
      "projects",
      "ls",
      "skills",
      "contact",
      "experience",
      "education",
      "clear",
      "cls",
      "github",
      "linkedin",
      "resume",
      "joke",
      "exit",
    ]

    // Levenshtein distance algorithm
    const levenshteinDistance = (str1: string, str2: string): number => {
      const matrix = []

      for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i]
      }

      for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j
      }

      for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
          if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1]
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          }
        }
      }

      return matrix[str2.length][str1.length]
    }

    let closestCommand = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const command of availableCommands) {
      const distance = levenshteinDistance(input.toLowerCase(), command.toLowerCase())
      // Only suggest if the distance is reasonable (less than half the command length)
      if (distance < minDistance && distance <= Math.max(2, Math.floor(command.length / 2))) {
        minDistance = distance
        closestCommand = command
      }
    }

    return closestCommand
  }

  const commands = {
    help: () => [
      "Available commands:",
      "",
      "  <span class='text-white'>help, h</span>          <span class='text-white'>-</span> <span class='text-red-400'>Show this help message</span>",
      "  <span class='text-white'>about, whoami</span>    <span class='text-white'>-</span> <span class='text-green-400'>Learn about me</span>",
      "  <span class='text-white'>projects, ls</span>     <span class='text-white'>-</span> <span class='text-blue-400'>View my projects</span>",
      "  <span class='text-white'>skills</span>           <span class='text-white'>-</span> <span class='text-yellow-400'>See my technical skills</span>",
      "  <span class='text-white'>contact</span>          <span class='text-white'>-</span> <span class='text-red-400'>Get in touch</span>",
      "  <span class='text-white'>experience</span>       <span class='text-white'>-</span> <span class='text-green-400'>View work experience</span>",
      "  <span class='text-white'>education</span>        <span class='text-white'>-</span> <span class='text-blue-400'>Academic background</span>",
      "  <span class='text-white'>clear, cls</span>       <span class='text-white'>-</span> <span class='text-yellow-400'>Clear terminal</span>",
      "  <span class='text-white'>github</span>           <span class='text-white'>-</span> <span class='text-red-400'>Open GitHub profile</span>",
      "  <span class='text-white'>linkedin</span>         <span class='text-white'>-</span> <span class='text-green-400'>Open LinkedIn profile</span>",
      "  <span class='text-white'>resume</span>           <span class='text-white'>-</span> <span class='text-blue-400'>Download resume</span>",
      "  <span class='text-white'>joke</span>             <span class='text-white'>-</span> <span class='text-cyan-400'>Get a programming joke</span>",
      "  <span class='text-white'>exit</span>             <span class='text-white'>-</span> <span class='text-red-400'>Exit terminal</span>",
      "",
    ],
    h: () => commands.help(),
    about: () => [
      "<span class='text-cyan-400'>sankalp@portfolio:~$ whoami</span>",
      "",
      '<span class="text-yellow-400">export</span> <span class="text-blue-400">NAME</span>=<span class="text-green-400">"Sankalp Prajapati"</span>',
      '<span class="text-yellow-400">export</span> <span class="text-blue-400">ROLE</span>=<span class="text-green-400">"Computer Science Student & Developer"</span>',
      '<span class="text-yellow-400">export</span> <span class="text-blue-400">LOCATION</span>=<span class="text-green-400">"Varanasi, UP → KIIT University, Bhubaneswar"</span>',
      '<span class="text-yellow-400">export</span> <span class="text-blue-400">CGPA</span>=<span class="text-green-400">"9.09/10.0"</span>',
      "",
      "<span class='text-white'>A Computer Science student at</span> <span class='text-blue-400'>KIIT University</span> <span class='text-white'>who:</span>",
      "<span class='text-green-400'>•</span> <span class='text-white'>Writes code that compiles on the third try</span> <span class='text-gray-400'>(optimistic estimate)</span>",
      "<span class='text-green-400'>•</span> <span class='text-white'>Debugs life one</span> <span class='text-yellow-400'>console.log()</span> <span class='text-white'>at a time</span>",
      "<span class='text-green-400'>•</span> <span class='text-white'>Fluent in</span> <span class='text-cyan-400'>Stack Overflow</span> <span class='text-white'>and caffeine</span>",
      "<span class='text-green-400'>•</span> <span class='text-white'>Currently pursuing B.Tech with</span> <span class='text-yellow-400'>stellar academic performance</span>",
      "",
      "<span class='text-purple-400'>Hobbies and interests outside coding:</span>",
      "<span class='text-cyan-400'>~/interests/sports</span> <span class='text-white'>→</span> <span class='text-green-400'>Volleyball, Badminton</span>",
      "<span class='text-cyan-400'>~/interests/music</span> <span class='text-white'>→</span> <span class='text-green-400'>Guitar</span>",
      "<span class='text-cyan-400'>~/interests/adventure</span> <span class='text-white'>→</span> <span class='text-green-400'>Trekking</span>",
      "<span class='text-cyan-400'>~/interests/games</span> <span class='text-white'>→</span> <span class='text-green-400'>Chess on chess.com (handle: Sunkey107)</span>",
      "",
      "<span class='text-yellow-400'>console.log(</span><span class='text-green-400'>\"Fun fact: I debug faster than I create bugs... usually.\"</span><span class='text-yellow-400'>);</span>",
      "",
    ],
    whoami: () => commands.about(),
    projects: () => [
      "<span class='text-blue-400'>📁 ~/projects/</span>",
      "",
      "<span class='text-yellow-400'>📄 Anti-Spoofing Attack</span> <span class='text-gray-400'>(May 2024 - Jul 2024)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Digilocker and Entity Locker security enhancement</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Built CNN models with</span> <span class='text-yellow-400'>95% accuracy</span> <span class='text-white'>in detecting image spoofing</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Processed</span> <span class='text-cyan-400'>10,000+</span> <span class='text-white'>images using OpenCV and deep learning</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-purple-400'>Technologies:</span> <span class='text-blue-400'>Python, OpenCV, TensorFlow, ResNet</span>",
      "",
      "<span class='text-yellow-400'>📱 Nagrik Aur Samvidhan Mobile App</span> <span class='text-gray-400'>(Nov 2024 - Dec 2024)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-red-400'>SIH'24 Runner-up project</span> <span class='text-yellow-400'>(Top 5 in country!)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>AI chatbot for Indian Constitution simplification</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Multilingual text-to-speech and notifications</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-purple-400'>Technologies:</span> <span class='text-blue-400'>React Native, Flask, MySQL</span>",
      "",
      "<span class='text-cyan-400'>💡 More projects in development...</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-gray-400'>Because perfect code is a myth, but we chase it anyway</span>",
      "",
    ],
    ls: () => commands.projects(),
    skills: () => [
      "<span class='text-yellow-400'>🛠️  Technical Arsenal:</span>",
      "",
      "<span class='text-blue-400'>Languages:</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>C/C++</span> <span class='text-gray-400'>(Memory management builds character)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Java</span> <span class='text-gray-400'>(Write once, debug everywhere)</span>",
      "  <span class='text-green-400'>└──</span> <span class='text-white'>Python</span> <span class='text-gray-400'>(Life's too short for semicolons)</span>",
      "",
      "<span class='text-purple-400'>Frameworks & Tools:</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Git</span> <span class='text-gray-400'>(Time travel for code mistakes)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>OpenCV</span> <span class='text-gray-400'>(Teaching machines to see better than me)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>NumPy & Pandas</span> <span class='text-gray-400'>(Data wrangling ninjas)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Linux</span> <span class='text-gray-400'>(Home is where the terminal is)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>TensorFlow</span> <span class='text-gray-400'>(Making silicon smarter than me)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Figma</span> <span class='text-gray-400'>(Making pixels behave)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>SQL</span> <span class='text-gray-400'>(Whispering to databases)</span>",
      "  <span class='text-green-400'>└──</span> <span class='text-white'>React Native</span> <span class='text-gray-400'>(One codebase, infinite possibilities)</span>",
      "",
      "<span class='text-cyan-400'>Soft Skills:</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Problem Solving</span> <span class='text-gray-400'>(Professional puzzle solver)</span>",
      "  <span class='text-green-400'>├──</span> <span class='text-white'>Team Leadership</span> <span class='text-gray-400'>(Herding developers since 2024)</span>",
      "  <span class='text-green-400'>└──</span> <span class='text-white'>Teaching</span> <span class='text-gray-400'>(Explaining code to humans and machines)</span>",
      "",
    ],
    contact: () => [
      "<span class='text-yellow-400'>📞 Get In Touch:</span>",
      "",
      "<span class='text-white'>📧 Email:</span> <span class='text-blue-400'>meissankalp@gmail.com</span>",
      "<span class='text-white'>📱 Phone:</span> <span class='text-green-400'>+91-7348476177</span>",
      "<span class='text-white'>🏠 Location:</span> <span class='text-cyan-400'>Varanasi, UP (Currently in Bhubaneswar)</span>",
      "<span class='text-white'>🐙 GitHub:</span> <span class='text-red-400'>https://github.com/dead10GOD</span> <span class='text-gray-400'>(Where code goes to live)</span>",
      "<span class='text-white'>💼 LinkedIn:</span> <span class='text-green-400'>https://www.linkedin.com/in/sankalp-prajapati-592b50278/</span> <span class='text-gray-400'>(Professional facade)</span>",
      "<span class='text-white'>♟️  Chess:</span> <span class='text-yellow-400'>chess.com/member/Sunkey107</span> <span class='text-gray-400'>(Strategic thinking practice)</span>",
      "",
      "<span class='text-white'>I'm always open to discussing new opportunities,</span>",
      "<span class='text-white'>collaborations, or just having a chat about technology!</span>",
      "",
      "<span class='text-white'>Response time:</span> <span class='text-green-400'>Usually within 24 hours ⚡</span>",
      "<span class='text-gray-400'>(Unless I'm in a debugging rabbit hole)</span>",
      "",
    ],
    experience: () => [
      "<span class='text-yellow-400'>💼 Work Experience:</span>",
      "",
      "<span class='text-white'>🎓 Teaching Assistant -</span> <span class='text-blue-400'>KIIT University</span> <span class='text-gray-400'>(Nov 2024 - Apr 2025)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Conducted weekly C programming classes for</span> <span class='text-cyan-400'>50+ students</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Provided one-on-one mentoring in programming & math</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-white'>Turned compilation errors into learning opportunities</span>",
      "",
      "<span class='text-white'>🏛️  Summer Intern -</span> <span class='text-blue-400'>Digital India Corporation</span> <span class='text-gray-400'>(May 2024 - Jul 2024)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Developed anti-spoofing measures for</span> <span class='text-yellow-400'>DigiLocker platforms</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Built CNN models with</span> <span class='text-yellow-400'>95% accuracy</span> <span class='text-white'>in spoofing detection</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-white'>Made computers better at spotting fakes than humans</span>",
      "",
      "<span class='text-white'>📢 PR/Marketing Lead -</span> <span class='text-blue-400'>Coding Ninjas Club</span> <span class='text-gray-400'>(Jun 2024 - Oct 2024)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Secured partnerships and sponsorships for club events</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Led marketing campaigns resulting in</span> <span class='text-cyan-400'>50% membership increase</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-white'>Proved developers can communicate beyond code comments</span>",
      "",
    ],
    education: () => [
      "<span class='text-yellow-400'>🎓 Academic Background:</span>",
      "",
      "<span class='text-white'>🏫</span> <span class='text-blue-400'>KIIT University, Bhubaneswar, Odisha</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>B.Tech in Computer Science and Engineering</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Duration: Sep 2022 - Present</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>CGPA:</span> <span class='text-green-400'>9.09/10.0</span> <span class='text-gray-400'>(Perfectionism is a feature, not a bug)</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-white'>Status: Learning, coding, repeat</span>",
      "",
      "<span class='text-white'>📚 What I'm learning:</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Data Structures & Algorithms</span> <span class='text-gray-400'>(The art of organized chaos)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Machine Learning</span> <span class='text-gray-400'>(Teaching silicon to think)</span>",
      "   <span class='text-green-400'>├──</span> <span class='text-white'>Software Engineering</span> <span class='text-gray-400'>(Building digital architecture)</span>",
      "   <span class='text-green-400'>└──</span> <span class='text-white'>Database Management</span> <span class='text-gray-400'>(Where data finds its home)</span>",
      "",
    ],
    github: () => {
      window.open("https://github.com/dead10GOD", "_blank")
      return [
        "🐙 Opening GitHub profile...",
        "https://github.com/dead10GOD",
        "",
        'echo "Warning: Repository may contain experimental features" 🧪',
        "",
      ]
    },
    linkedin: () => {
      window.open("https://www.linkedin.com/in/sankalp-prajapati-592b50278/", "_blank")
      return [
        "💼 Opening LinkedIn profile...",
        "https://www.linkedin.com/in/sankalp-prajapati-592b50278/",
        "",
        'echo "Professional mode: activated" 💼',
        "",
      ]
    },
    // resume: () => {
    //   window.open("https://drive.google.com/file/d/1RfJps5GucfugGJZ_uFinpb3V-RfILZlQ/view?usp=sharing", "_blank")
    //   return [
    //     "📄 Opening resume...",
    //     ". . . . . . .",
    //     "",
    //     'echo "Warning: May cause spontaneous hiring 📄"',
    //     "",
    //   ]
    // },

    resume: () => {
  // window.open("https://drive.google.com/file/d/1RfJps5GucfugGJZ_uFinpb3V-RfILZlQ/view?usp=sharing", "_blank");
  return [
    "📄 Opening resume...",
    ". . . . . . .",
    "",
    '<span style="color:red;">echo "Warning: May cause spontaneous hiring 📄"</span>',
    "",
  ];
},
    joke: () => {
      return ["Really ? You here for the jokes ?", ""]
    },
    clear: () => {
      setHistory([])
      return []
    },
    cls: () => commands.clear(),
    exit: () => {
      return ["Goodbye ! May the devil bless you :)", ""]
    },
  }

  const handleCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (trimmedCmd === "clear" || trimmedCmd === "cls") {
      setHistory([])
      return
    }

    const output = commands[trimmedCmd as keyof typeof commands]
      ? commands[trimmedCmd as keyof typeof commands]()
      : (() => {
          const suggestion = getClosestCommand(trimmedCmd)
          return suggestion
            ? [
                `Command not found: ${cmd}`,
                `<span class='text-yellow-400'>Did you mean:</span> <span class='text-cyan-400'>${suggestion}</span>`,
                "",
                "Type 'help' to see all available commands",
                "",
              ]
            : [
                `Command not found: ${cmd}`,
                "Type 'help' to see available commands",
                "",
                "💡 Pro tip: Even Google can't find that command!",
                "",
              ]
        })()

    setHistory((prev) => [...prev, { input: cmd, output }])

    // Add to command history if not empty
    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd.trim()])
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input)
      setInput("")
      setHistoryIndex(-1)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setInput("")
        } else {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        }
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-black text-green-400 font-mono text-xs sm:text-sm p-2 sm:p-4 cursor-text overflow-x-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header with time */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 text-green-300 text-xs z-10 bg-black bg-opacity-80 px-2 py-1 rounded">
        <div className="hidden sm:block" dangerouslySetInnerHTML={{ __html: currentTime }} />
        <div
          className="sm:hidden"
          dangerouslySetInnerHTML={{ __html: currentTime.split(",")[1]?.trim() || currentTime }}
        />
      </div>

      {/* Terminal content */}
      <div ref={terminalRef} className="max-w-full sm:max-w-4xl mx-auto">
        {/* Terminal header */}
        <div className="text-green-300 mb-2 sm:mb-4 border-b border-green-800 pb-2">
          <span className="text-green-400">➜</span> prajapati@sankalp:~
        </div>

        {/* Command history */}
        {history.map((cmd, index) => (
          <div key={index} className="mb-2">
            {cmd.input && (
              <div className="flex items-center mb-1">
                <span className="text-green-400 mr-2">$</span>
                <span className="text-white">{cmd.input}</span>
              </div>
            )}
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="ml-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: line }} />
            ))}
          </div>
        ))}

        {/* Current input line */}
        <div ref={currentInputRef} className="flex items-center">
          <span className="text-green-400 mr-1 sm:mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-white flex-1 font-mono text-xs sm:text-sm"
            autoComplete="off"
            spellCheck="false"
          />
          <span className="animate-pulse text-white">|</span>
        </div>

        {/* Footer */}
        <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 text-right text-green-600 text-xs bg-black bg-opacity-80 px-2 py-1 rounded">
          Type 'help' for commands
        </div>
      </div>
    </div>
  )
}
