package com.amardeen.islamicapp.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.amardeen.islamicapp.data.repository.PreferencesRepository
import com.amardeen.islamicapp.ui.navigation.BottomNavBar
import com.amardeen.islamicapp.ui.navigation.Screen
import com.amardeen.islamicapp.ui.screens.azkar.AzkarScreen
import com.amardeen.islamicapp.ui.screens.bookmarks.BookmarksScreen
import com.amardeen.islamicapp.ui.screens.calendar.CalendarScreen
import com.amardeen.islamicapp.ui.screens.duas.DuasScreen
import com.amardeen.islamicapp.ui.screens.home.HomeScreen
import com.amardeen.islamicapp.ui.screens.knowledge.KnowledgeScreen
import com.amardeen.islamicapp.ui.screens.more.MoreScreen
import com.amardeen.islamicapp.ui.screens.prayer.PrayerScreen
import com.amardeen.islamicapp.ui.screens.qibla.QiblaScreen
import com.amardeen.islamicapp.ui.screens.quran.QuranListScreen
import com.amardeen.islamicapp.ui.screens.quran.SurahReaderScreen
import com.amardeen.islamicapp.ui.screens.ramadan.RamadanScreen
import com.amardeen.islamicapp.ui.screens.settings.SettingsScreen
import com.amardeen.islamicapp.ui.screens.tasbih.TasbihScreen
import com.amardeen.islamicapp.ui.screens.umrah.UmrahScreen
import com.amardeen.islamicapp.ui.theme.AmarDeenTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val preferencesRepo = PreferencesRepository(applicationContext)

        setContent {
            val userDarkMode by preferencesRepo.isDarkMode.collectAsState()
            val systemDark = isSystemInDarkTheme()
            val isDark = if (preferencesRepo.hasUserSelectedDarkMode()) userDarkMode else systemDark

            AmarDeenTheme(darkTheme = isDark) {
                MainAppContent(preferencesRepo = preferencesRepo)
            }
        }
    }
}

@Composable
fun MainAppContent(preferencesRepo: PreferencesRepository) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    // Hide BottomNavBar on reader screen for full immersion
    val showBottomNav = currentRoute != null && !currentRoute.startsWith("surah_reader")

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            if (showBottomNav) {
                BottomNavBar(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        if (route == Screen.Home.route) {
                            if (!navController.popBackStack(Screen.Home.route, inclusive = false)) {
                                navController.navigate(Screen.Home.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        inclusive = true
                                    }
                                    launchSingleTop = true
                                }
                            }
                        } else if (route == Screen.More.route) {
                            // If user clicks Menu tab, pop any child subpages back to MoreScreen, or navigate directly to it
                            if (!navController.popBackStack(Screen.More.route, inclusive = false)) {
                                navController.navigate(Screen.More.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                }
                            }
                        } else {
                            if (!navController.popBackStack(route, inclusive = false)) {
                                navController.navigate(route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            NavHost(
                navController = navController,
                startDestination = Screen.Home.route
            ) {
                composable(Screen.Home.route) {
                    HomeScreen(
                        preferencesRepo = preferencesRepo,
                        onNavigate = { route -> navController.navigate(route) }
                    )
                }

                composable(Screen.Quran.route) {
                    QuranListScreen(
                        onSurahClick = { surahNumber ->
                            navController.navigate(Screen.SurahReader.createRoute(surahNumber))
                        }
                    )
                }

                composable(
                    route = Screen.SurahReader.route,
                    arguments = listOf(navArgument("surahNumber") { type = NavType.IntType })
                ) { backStackEntry ->
                    val surahNumber = backStackEntry.arguments?.getInt("surahNumber") ?: 1
                    SurahReaderScreen(
                        surahNumber = surahNumber,
                        onBack = { navController.popBackStack() },
                        onNavigateToSurah = { targetSurah ->
                            navController.navigate(Screen.SurahReader.createRoute(targetSurah)) {
                                popUpTo(Screen.Quran.route)
                            }
                        }
                    )
                }

                composable(Screen.Prayer.route) {
                    PrayerScreen(
                        preferencesRepo = preferencesRepo,
                        onNavigate = { route -> navController.navigate(route) }
                    )
                }

                composable(Screen.Duas.route) {
                    DuasScreen(preferencesRepo = preferencesRepo)
                }

                composable(Screen.Qibla.route) {
                    QiblaScreen(
                        preferencesRepo = preferencesRepo,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.Azkar.route) {
                    AzkarScreen(onBack = { navController.popBackStack() })
                }

                composable(Screen.Tasbih.route) {
                    TasbihScreen(
                        preferencesRepo = preferencesRepo,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.Ramadan.route) {
                    RamadanScreen(
                        preferencesRepo = preferencesRepo,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.Umrah.route) {
                    UmrahScreen(
                        preferencesRepo = preferencesRepo,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.Calendar.route) {
                    CalendarScreen(onBack = { navController.popBackStack() })
                }

                composable(Screen.Knowledge.route) {
                    KnowledgeScreen(onBack = { navController.popBackStack() })
                }

                composable(Screen.Bookmarks.route) {
                    BookmarksScreen(
                        preferencesRepo = preferencesRepo,
                        onNavigate = { route -> navController.navigate(route) },
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.Settings.route) {
                    SettingsScreen(
                        preferencesRepo = preferencesRepo,
                        onBack = { navController.popBackStack() }
                    )
                }

                composable(Screen.More.route) {
                    MoreScreen(
                        preferencesRepo = preferencesRepo,
                        onNavigate = { route -> navController.navigate(route) }
                    )
                }
            }
        }
    }
}
