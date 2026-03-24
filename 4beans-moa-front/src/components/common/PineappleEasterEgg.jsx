import { useEffect, useRef, useState } from 'react';

const PineappleEasterEgg = ({ showToggle = true }) => {
    const containerRef = useRef(null);
    const [pineapples, setPineapples] = useState([]);
    const [clickCount, setClickCount] = useState(0);
    const [isEnabled, setIsEnabled] = useState(true); // Toggle effect
    const requestRef = useRef();

    // Initialize pineapples
    useEffect(() => {
        const count = 3;
        const speed = 3;
        const initialPineapples = Array.from({ length: count }).map(() => ({
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 50),
            y: Math.random() * (window.innerHeight - 50),
            vx: (Math.random() - 0.5) * speed * 2,
            vy: (Math.random() - 0.5) * speed * 2,
            size: 20 + Math.random() * 30,
            status: 'active',
            scale: 1,
            opacity: 1,
            isSpecial: false,
        }));
        setPineapples(initialPineapples);

        const handleResize = () => {
            // Optional: Handle resize if necessary
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePineappleClick = (id) => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        setPineapples((prev) => {
            return prev.map((p) => {
                if (p.id === id) {
                    const isSpecialRound = newCount % 10 === 0;
                    return {
                        ...p,
                        status: 'exploding',
                        explosionStart: Date.now(),
                        isSpecial: isSpecialRound,
                        hue: isSpecialRound ? Math.random() * 360 : 0,
                    };
                }
                return p;
            });
        });
    };

    // Animation Loop
    useEffect(() => {
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            setPineapples((prevPineapples) => {
                const now = Date.now();
                return prevPineapples.map((p) => {
                    // Handle Hidden State (Respawn)
                    if (p.status === 'hidden') {
                        if (now > p.respawnTime) {
                            return {
                                ...p,
                                status: 'active',
                                x: Math.random() * (window.innerWidth - 50),
                                y: Math.random() * (window.innerHeight - 50),
                                vx: (Math.random() - 0.5) * 6,
                                vy: (Math.random() - 0.5) * 6,
                                scale: 1,
                                opacity: 1,
                            };
                        }
                        return p;
                    }

                    // Handle Exploding State
                    if (p.status === 'exploding') {
                        const progress = (now - p.explosionStart) / 300; // 300ms explosion
                        if (progress >= 1) {
                            return { ...p, status: 'hidden', respawnTime: now + 10000 }; // 10s respawn
                        }
                        return { ...p, scale: 1 + progress * 2, opacity: 1 - progress };
                    }

                    // Active State Logic
                    let { x, y, vx, vy } = p;

                    // 1. Mouse Repulsion
                    const dx = x - mouseX;
                    const dy = y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const repulsionRadius = 150;

                    if (distance < repulsionRadius) {
                        const force = (repulsionRadius - distance) / repulsionRadius;
                        const angle = Math.atan2(dy, dx);
                        const pushStrength = 0.5;

                        vx += Math.cos(angle) * pushStrength * force;
                        vy += Math.sin(angle) * pushStrength * force;
                    }

                    // 2. Base Movement (Constant Speed Logic)
                    const currentSpeed = Math.sqrt(vx * vx + vy * vy);
                    const targetSpeed = 3.0;

                    if (currentSpeed > 0) {
                        const scale = (currentSpeed + (targetSpeed - currentSpeed) * 0.05) / currentSpeed;
                        vx *= scale;
                        vy *= scale;
                    }

                    // Move
                    x += vx;
                    y += vy;

                    // 3. Boundary Bounce
                    const padding = 50;
                    if (x <= 0) { x = 0; vx = Math.abs(vx); }
                    if (x >= window.innerWidth - padding) { x = window.innerWidth - padding; vx = -Math.abs(vx); }
                    if (y <= 0) { y = 0; vy = Math.abs(vy); }
                    if (y >= window.innerHeight - padding) { y = window.innerHeight - padding; vy = -Math.abs(vy); }

                    return { ...p, x, y, vx, vy, scale: 1, opacity: 1 };
                });
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <>
            {/* Toggle Button - Only show if showToggle is true */}
            {showToggle && (
                <button
                    onClick={() => setIsEnabled(!isEnabled)}
                    style={{
                        position: 'fixed',
                        bottom: '32px',
                        left: '170px',
                        zIndex: 10000,
                        background: isEnabled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        transition: 'all 0.3s ease',
                    }}
                    title={isEnabled ? "파인애플 숨기기" : "파인애플 보이기"}
                >
                    {isEnabled ? '🍍' : '🚫'}
                </button>
            )}

            {/* Pineapple Container */}
            {isEnabled && (
                <div
                    ref={containerRef}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        overflow: 'hidden',
                    }}
                >
                    {pineapples.map((p) => (
                        <div
                            key={p.id}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handlePineappleClick(p.id);
                            }}
                            style={{
                                position: 'absolute',
                                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                                opacity: p.opacity,
                                fontSize: `${p.size}px`,
                                userSelect: 'none',
                                willChange: 'transform, opacity',
                                pointerEvents: p.status === 'active' ? 'auto' : 'none',
                                cursor: 'pointer',
                                display: p.status === 'hidden' ? 'none' : 'block',
                                transition: p.status === 'exploding' ? 'none' : 'transform 0.1s linear',
                                filter: p.isSpecial ? `hue-rotate(${p.hue}deg) drop-shadow(0 0 10px rgba(255,255,255,0.8))` : 'none',
                            }}
                        >
                            🍍
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default PineappleEasterEgg;
