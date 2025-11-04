import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, BarChart3, Sparkles } from 'lucide-react';

/**
 * Sección de bienvenida introductoria
 * Muestra tarjetas informativas sobre los beneficios de la aplicación.
 */
const WelcomeSection = () => {
    const features = [
        {
            icon: <CalendarDays className="text-blue-700" size={30} />,
            title: 'Planifica sin esfuerzo',
            description:
                'Organiza tus actividades diarias y mantén control total de tus metas en un solo lugar.',
            color: 'bg-blue-100',
        },
        {
            icon: <Users className="text-emerald-600" size={30} />,
            title: 'Colabora con tu equipo',
            description:
                'Comparte tareas y proyectos en tiempo real con tus compañeros, manteniendo todo sincronizado.',
            color: 'bg-emerald-100',
        },
        {
            icon: <BarChart3 className="text-purple-700" size={30} />,
            title: 'Mide tu progreso',
            description:
                'Visualiza reportes y métricas de rendimiento para tomar decisiones informadas.',
            color: 'bg-purple-100',
        },
        {
            icon: <Sparkles className="text-yellow-600" size={30} />,
            title: 'Automatiza tus flujos',
            description:
                'Deja que Zenwk haga el trabajo pesado y enfócate en lo que realmente importa.',
            color: 'bg-yellow-100',
        },
    ];

    return (
        <section className="flex w-full flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-[860px]">
                {/* Encabezado principal */}
                <motion.header
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
                        Bienvenido a{' '}
                        <span className="text-[#1D4087] drop-shadow-sm">
                            Zenwk
                        </span>
                    </h1>
                    <p className="mx-auto max-w-[720px] text-lg text-gray-600">
                        Gestiona tu tiempo, optimiza tu equipo y alcanza tus
                        metas con claridad y propósito.
                    </p>
                </motion.header>

                {/* Grid de tarjetas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {features.map((f, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md transition-shadow hover:shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={`mb-4 ${f.color} rounded-full p-3`}>
                                {f.icon}
                            </div>
                            <h2 className="mb-2 text-lg font-semibold text-gray-800">
                                {f.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Botón de acción */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                >
                    <button className="rounded-xl bg-[#1D4087] px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-[#153066] hover:shadow-md">
                        Comienza ahora
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default WelcomeSection;
