// components/Scene/ScreenManager.tsx
import { useRef, useEffect, useState, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FordJohnsonSorter } from './FordJohnson'
import { useCamera } from '../../../../hooks/useCamera'

interface ScreenManagerProps {
  screenMesh: THREE.Mesh
  isPoweredOn?: boolean
}

//  const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//     navigator.userAgent
//   ) || window.innerWidth < 768;
const isMobile = window.innerWidth < 768;  

export function ScreenManager({ screenMesh, isPoweredOn = true }: ScreenManagerProps) {
  const [inputText, setInputText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cursorIndex, setCursorIndex] = useState(0)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [isInViewerMode, setIsInViewerMode] = useState(false)
  const [viewerContentLines, setViewerContentLines] = useState<string[]>([])
  const [viewerScrollIndex, setViewerScrollIndex] = useState(0)
  const [currentDirectory, setCurrentDirectory] = useState('/')
  const [, setImageTexture] = useState<THREE.Texture | null>(null)
  const { currentView } = useCamera()
  const { invalidate } = useThree()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const cursorBlinkInterval = 500

  const files = {
    '/': ['files', 'programs', 'images'],
    '/files': ['AboutMe.txt', 'Notes.txt', 'Hamlet.txt'],
    '/images': ['42.jpeg', 'my_room.jpg'],
    '/programs': ['fordjohnson']
  }

  useEffect(() => {

    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    canvas.style.display = 'none'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        console.error("Failed to get canvas context")
        return
    }

    screenMesh.position.z += 0.001

    const texture = new THREE.CanvasTexture(canvas)
    textureRef.current = texture

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide,
    })
    materialRef.current = material

    screenMesh.material = materialRef.current
    texture.flipY = false;
 
    if (!isMobile) {
      setOutputLines([
        'Welcome to ngaurama-Linux 1.0 LTS',
        '>> Type "help" to get started',
        ''
      ])
    } else {
      setOutputLines([
        'Welcome to ngaurama-Linux 1.0 LTS',
        '>> Please use desktop',
        ''
      ])
    }

    setTimeout(() => {
      renderContent()
    }, 100)
    
    return () => {
      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current)
        canvasRef.current = null
      }
      if (textureRef.current) {
        textureRef.current.dispose()
      }
      if (materialRef.current) {
        materialRef.current.dispose()
      }
    }
  }, [screenMesh, isPoweredOn])

  useEffect(() => {
      if (!isPoweredOn) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (currentView !== 'laptop' && currentView !== 'front')
          return
        if (isInViewerMode) {
            handleViewerInput(event)
            return
        }

        // event.preventDefault()

        switch (event.key) {
            case 'Enter':
                if (inputText) {
                    setCommandHistory(prev => [inputText, ...prev])
                }
                setHistoryIndex(-1)
                handleCommand(inputText)
                setInputText('')
                setCursorIndex(0)
                break

            case 'Backspace':
                if (cursorIndex > 0) {
                    setInputText(prev => prev.slice(0, cursorIndex - 1) + prev.slice(cursorIndex))
                    setCursorIndex(cursorIndex - 1)
                }
                break

            case 'Delete':
                if (cursorIndex < inputText.length) {
                    setInputText(prev => prev.slice(0, cursorIndex) + prev.slice(cursorIndex + 1))
                }
                break

            case 'ArrowLeft':
                if (cursorIndex > 0) setCursorIndex(cursorIndex - 1)
                break

            case 'ArrowRight':
                if (cursorIndex < inputText.length) setCursorIndex(cursorIndex + 1)
                break

            // Command history navigation
            case 'ArrowUp':
                if (commandHistory.length > 0) {
                    const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
                    setHistoryIndex(newIndex)
                    setInputText(commandHistory[newIndex] || '')
                    setCursorIndex(commandHistory[newIndex]?.length || 0)
                }
                break

            case 'ArrowDown':
                if (commandHistory.length > 0) {
                    const newIndex = historyIndex > 0 ? historyIndex - 1 : -1
                    setHistoryIndex(newIndex)
                    const newText = newIndex >= 0 ? commandHistory[newIndex] : ''
                    setInputText(newText)
                    setCursorIndex(newText.length)
                }
                break

            case 'Home':
                setCursorIndex(0)
                break

            case 'End':
                setCursorIndex(inputText.length)
                break

            default:
                if (event.key.length === 1 && inputText.length < 38) {
                    const newText = inputText.slice(0, cursorIndex) + event.key + inputText.slice(cursorIndex)
                    setInputText(newText)
                    setCursorIndex(cursorIndex + 1)
                }
                break
          }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cursorIndex, isInViewerMode, isPoweredOn, inputText, commandHistory, historyIndex, currentView])

  const handleViewerInput = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        setViewerScrollIndex(prev => Math.min(prev + 1, viewerContentLines.length - 1))
        break
      case 'ArrowUp':
        setViewerScrollIndex(prev => Math.max(prev - 1, 0))
        break
      case 'q':
        setIsInViewerMode(false)
        if (materialRef.current && screenMesh) {
          screenMesh.material = materialRef.current
        }
        break
    }
  }, [viewerContentLines.length, screenMesh])

  const handleCommand = useCallback((command: string) => {
    let response = ''

    setOutputLines(prev => [...prev, `user@42:~${currentDirectory} $ ${command}`])

    switch (command.toLowerCase()) {
      case 'help':
        response = 'Available commands:\n > ls\n> help\n > clear\n > cd [dir] \n > cat [*.txt]\n > view [*.jpg/jpeg/png]\n > run [fordjohnson {numbers}]\n > press "q" to exit image or text'
        break

      case 'clear':
        setOutputLines([
          'Welcome to ngaurama-Linux 1.8 LTS',
          '>> Type "help" to get started',
          ''
        ])
        return

      case 'ls':
        response = `Directory ${currentDirectory}: ${files[currentDirectory as keyof typeof files]?.join(', ') || 'Empty'}`
        break

      case 'pwd':
        response = `Current directory: ${currentDirectory}`
        break

      default:
        if (command.toLowerCase().startsWith('cd ')) {
          const parts = command.split(' ').filter(part => part.trim() !== '')
          if (parts.length === 2) {
            const dir = parts[1].toLowerCase()
            if (dir === '..' && currentDirectory !== '/') {
              setCurrentDirectory('/')
            } else if (files[currentDirectory as keyof typeof files]?.includes(dir)) {
              setCurrentDirectory(`/${dir}`)
            } else {
              response = `Directory '${parts[1]}' not found.`
            }
          } else {
            response = 'Usage: cd [dir] (e.g., cd files, cd ..)'
          }
        } else if (command.toLowerCase().startsWith('cat ')) {
          const parts = command.split(' ').filter(part => part.trim() !== '')
          if (parts.length === 2 && !parts[1].toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            const file = parts[1]
            if (files[currentDirectory as keyof typeof files]?.includes(file)) {
              loadAndViewFile(`/files/${file}`)
            } else {
              response = `File '${file}' not found in ${currentDirectory}.`
            }
          } else {
            response = 'Usage: cat [file]'
          }
        } else if (command.toLowerCase().startsWith('view ')) {
          const parts = command.split(' ').filter(part => part.trim() !== '')
          if (parts.length === 2 && parts[1].toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            const file = parts[1]
            if (files[currentDirectory as keyof typeof files]?.includes(file)) {
              loadAndViewImage(`/images/${file}`)
            } else {
              response = `Image '${file}' not found in ${currentDirectory}.`
            }
          } else {
            response = 'Usage: view [image.jpg/jpeg/png]'
          }
        } else if (command.toLowerCase().startsWith('run fordjohnson')) {
          if (currentDirectory !== '/programs') {
            response = `Error: Program fordjohnson not found in ${currentDirectory}.`
          } else {
            const numbers = parseFordJohnsonCommand(command)
            if (numbers) {
              const sorter = new FordJohnsonSorter()
              const sorted = sorter.sort(numbers)
              response = `Sorted: ${sorted.join(', ')}`
            } else {
              response = 'Invalid format. Use: run fordjohnson [numbers]'
            }
          }
        } else {
          response = `Command '${command}' not recognized. Type 'help' for assistance.`
        }
        break
    }

    if (response) {
      const lines = response.split('\n')
      setOutputLines(prev => [...prev, ...lines])
    }
  }, [currentDirectory])

  const loadAndViewFile = async (filePath: string) => {
    try {
      const response = await fetch(filePath)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const content = await response.text()
      enterViewerMode(content)
    } catch (error) {
      enterViewerMode(`Error loading ${filePath}: ${error}`)
    }
  }

  const loadAndViewImage = async (imagePath: string) => {
    try {
      setIsInViewerMode(true)
      
      const textureLoader = new THREE.TextureLoader()
      textureLoader.load(
        imagePath,
        (texture) => {
          const imageMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            color: new THREE.Color(1, 1, 1),

          })
          texture.flipY = false;

          if (screenMesh) {
            screenMesh.material = imageMaterial
          }
          setImageTexture(texture)
        },
        undefined,
        (error) => {
          console.error('Error loading image:', error)
          enterViewerMode(`Failed to load image from ${imagePath}`)
        }
      )
    } catch (error) {
      enterViewerMode(`Error loading ${imagePath}: ${error}`)
    }
  }

  const enterViewerMode = (content: string) => {
    setIsInViewerMode(true)
    setViewerScrollIndex(0)
    const paragraphs = content.split(/\n\s*\n/).map(p => p.replace(/\n/g, ' '))
    const viewerLines: string[] = []
    
    for (let i = 0; i < paragraphs.length; i++) {
      viewerLines.push(paragraphs[i])
      if (i < paragraphs.length - 1) {
        viewerLines.push('')
      }
    }
    
    setViewerContentLines(viewerLines)
  }

  const parseFordJohnsonCommand = (command: string): number[] | null => {
    const parts = command.split(' ').filter(part => part !== './fordjohnson' && part.trim() !== '')
    const numbers = parts.map(part => parseInt(part)).filter(num => !isNaN(num))
    return numbers.length > 0 ? numbers : null
  }

  const renderContent = useCallback(() => {
    if (!canvasRef.current || !isPoweredOn) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const maxWidth = 560

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    //DEBUG STUF
    // ctx.strokeStyle = 'red'
    // ctx.lineWidth = 2
    // ctx.strokeRect(0, 0, width, height)
    //

    if (isInViewerMode) {
      renderViewer(ctx, maxWidth)
    } else {
      renderTerminal(ctx, maxWidth)
    }

    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  }, [inputText, cursorIndex, cursorVisible, outputLines, isInViewerMode, viewerContentLines, viewerScrollIndex, currentDirectory, isPoweredOn])

  const renderViewer = (ctx: CanvasRenderingContext2D, maxWidth: number) => {
    ctx.font = '16px monospace'
    ctx.fillStyle = '#00FF00'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    const visibleLines = viewerContentLines.slice(viewerScrollIndex, viewerScrollIndex + 22)
    let y = 20
    
    for (const line of visibleLines) {
      if (y + 20 > 540) break
      if (line.trim() === '') {
        y += 20
        continue
      }
      
      const words = line.split(' ')
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word
        const width = ctx.measureText(testLine).width
        
        if (width <= maxWidth) {
          currentLine = testLine
        } else {
          ctx.fillText(currentLine, 20, y)
          y += 20
          currentLine = word
        }
        if (y + 20 > 540) break
      }
      
      if (currentLine) {
        ctx.fillText(currentLine, 20, y)
        y += 20
      }
    }
    // ctx.strokeStyle = 'green'
    // ctx.lineWidth = 1
    // ctx.strokeRect(20, 20, maxWidth, height - 40)

    ctx.fillStyle = '#557700'
    ctx.fillText('          -- Arrow Keys to Navigate, Q to Exit --', 20, 560)
  }

  const renderTerminal = (ctx: CanvasRenderingContext2D, maxWidth: number) => {
    ctx.font = '18px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'

    //DEBUG STUff
    // ctx.strokeStyle = 'green'
    // ctx.lineWidth = 1
    // ctx.strokeRect(20, 20, maxWidth, height - 40)
    //

    const maxDisplayLines = 28
    const promptReservedLines = 2
    const availableLines = maxDisplayLines - promptReservedLines

    let displayLines = 0
    let startIndex = outputLines.length
    
    for (let i = outputLines.length - 1; i >= 0; i--) {
      const linesNeeded = calculateWrappedLines(ctx, outputLines[i], maxWidth)
      if (displayLines + linesNeeded <= availableLines) {
        displayLines += linesNeeded
        startIndex = i
      } else {
        break
      }
    }

    const outputToRender = outputLines.slice(startIndex)
    let y = 20

    for (const line of outputToRender) {
      if (line.startsWith('user@42')) {
        y = renderCommandLine(ctx, line, y, maxWidth)
      } else if (line) {
        ctx.fillStyle = (line.startsWith("Welcome") || line.startsWith(">>")) ? '#FFFFFF' : '#FFFF00'
        y = renderWrappedText(ctx, line, 20, y, maxWidth)
      } else {
        y += 20
      }
    }

    const promptPrefix = `user@42:~${currentDirectory} $ `
    ctx.fillStyle = '#00FF00'
    ctx.fillText(promptPrefix, 20, y)

    if (inputText) {
      ctx.fillStyle = '#FFFFFF'
      const promptWidth = ctx.measureText(promptPrefix).width
      y = renderWrappedText(ctx, inputText, 20 + promptWidth, y, maxWidth - promptWidth, true)
    }

    if (cursorVisible && !isInViewerMode) {
        const cursorY = inputText ? y -= 20 : y
        renderCursor(ctx, inputText, cursorIndex, promptPrefix, cursorY, maxWidth)
    }
  }

  const calculateWrappedLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): number => {
    if (!text) return 1
    
    const words = text.split(' ')
    let currentLine = ''
    let lineCount = 0
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const width = ctx.measureText(testLine).width
      
      if (width <= maxWidth) {
        currentLine = testLine
      } else {
        lineCount++
        currentLine = word
      }
    }
    
    if (currentLine) lineCount++
    return Math.max(lineCount, 1)
  }

  const renderCommandLine = (ctx: CanvasRenderingContext2D, line: string, y: number, maxWidth: number): number => {
    const promptEnd = line.indexOf('$ ') + 2
    const prompt = line.substring(0, promptEnd)
    const command = line.substring(promptEnd)

    ctx.fillStyle = '#00FF00'
    let currentY = renderWrappedText(ctx, prompt, 20, y, maxWidth)

    if (command) {
      ctx.fillStyle = '#FFFFFF'
      const promptWidth = ctx.measureText(prompt).width
      currentY = renderWrappedText(ctx, command, 20 + promptWidth, y, maxWidth - promptWidth, true)
    }

    return currentY
  }

  const renderWrappedText = (
    ctx: CanvasRenderingContext2D, 
    text: string, 
    x: number, 
    y: number, 
    maxWidth: number,
    isInput = false
  ): number => {
    if (!text) {
        return y + 20
    }

    const words = text.split(' ')
    let currentLine = ''
    let currentY = y
    let currentX = x
    let isFirstLine = false

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const width = ctx.measureText(testLine).width

      if (width <= maxWidth) {
        currentLine = testLine
      } else {
        if (currentLine) {
          ctx.fillText(currentLine, currentX, currentY)
          currentY += 20
          currentX = isInput && !isFirstLine ? 20 : x
          isFirstLine = true
        }
        currentLine = word
      }
    }

    if (currentLine) {
      ctx.fillText(currentLine, currentX, currentY)
      currentY += 20
    }

    return currentY
  }

  const renderCursor = (
    ctx: CanvasRenderingContext2D,
    inputText: string,
    cursorIndex: number,
    promptPrefix: string,
    y: number,
    maxWidth: number
  ) => {
    const promptWidth = ctx.measureText(promptPrefix).width
    let currentLine = ''
    const currentY = y
    let currentX = 20 + promptWidth
    let isFirstLine = true
    // let charsInCurrentLine = 0

    for (let i = 0; i < inputText.length; i++) {
      if (i === cursorIndex) break

      currentLine += inputText[i]
      // charsInCurrentLine++

      const width = ctx.measureText(currentLine).width
      const availableWidth = isFirstLine ? (maxWidth - promptWidth) : maxWidth

      if (width > availableWidth) {
        // currentY += 20
        currentLine = inputText[i]
        // charsInCurrentLine = 1
        currentX = 20
        isFirstLine = false
      }
    }

    const cursorX = currentX + ctx.measureText(currentLine).width - 5
    ctx.fillStyle = '#00FFFF'
    ctx.fillText('┃', cursorX, currentY)
  }

  const screenVisible = currentView === 'laptop' || currentView === 'front'

  useEffect(() => {
    if (!isPoweredOn || !screenVisible) return
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, cursorBlinkInterval)
    return () => clearInterval(interval)
  }, [isPoweredOn, screenVisible])

  useEffect(() => {
    if (!isPoweredOn || !screenVisible) return
    if (!isInViewerMode || (isInViewerMode && viewerContentLines.length > 0)) {
      renderContent()
      invalidate()
    }
  }, [isPoweredOn, screenVisible, isInViewerMode, viewerContentLines, renderContent, invalidate])

  return null
}
