import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, BarChart3, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import Text from '@/components/shared/common/Text';

/**
 * Sección de bienvenida introductoria
 * Muestra tarjetas informativas sobre los beneficios de la aplicación.
 */
const WelcomeSection = () => {
    const themeIndex = clsx('text-black');

    const features = React.useMemo(
        () => [
            {
                id: crypto.randomUUID(),
                icon: <CalendarDays className={themeIndex} size={30} />,
                title: 'Planifica sin esfuerzo',
                description:
                    '(Ambiente desarrollo perras!) Organiza tus actividades diarias y mantén control total de tus metas en un solo lugar.',
                color: 'bg-sky-50',
            },
            {
                id: crypto.randomUUID(),
                icon: <Users className={themeIndex} size={30} />,
                title: 'Colabora con tu equipo',
                description:
                    'Comparte tareas y proyectos en tiempo real con tus compañeros, manteniendo todo sincronizado.',
                color: 'bg-emerald-50',
            },
            {
                id: crypto.randomUUID(),
                icon: <BarChart3 className={themeIndex} size={30} />,
                title: 'Mide tu progreso',
                description:
                    'Visualiza reportes y métricas de rendimiento para tomar decisiones informadas.',
                color: 'bg-purple-50',
            },
            {
                id: crypto.randomUUID(),
                icon: <Sparkles className={themeIndex} size={30} />,
                title: 'Automatiza tus flujos',
                description:
                    'Deja que Zenwk haga el trabajo pesado y enfócate en lo que realmente importa.',
                color: 'bg-yellow-50',
            },
        ],
        [] //  Se ejecuta SOLO una vez
    );

    return (
        <section className="flex w-full flex-col items-center justify-center px-4">
            <div className="w-full max-w-[640px]">
                <motion.header
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-transparent text-center md:grid-cols-4">
                        {features.map((f, index) => (
                            <motion.div
                                key={f.id}
                                className="flex flex-col items-center rounded-2xl bg-transparent p-6 text-center shadow transition-shadow hover:bg-blue-50/30 hover:shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                            >
                                <div
                                    className={`mb-4 ${f.color} rounded-full p-3`}
                                >
                                    {f.icon}
                                </div>
                                <Text
                                    text={f.title}
                                    sizeOffset={30}
                                    className="mb-2 font-[450] text-black"
                                />
                                <Text
                                    text={f.description}
                                    sizeOffset={15}
                                    className="font-[370] text-gray-600/80"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.header>
            </div>
        </section>
    );
};

export default WelcomeSection;
