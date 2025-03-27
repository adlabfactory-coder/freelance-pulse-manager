import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Edit, Trash2, Copy, Download, Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '@/hooks/use-supabase';
import { useReactToPrint } from 'react-to-print';
import { formatCurrency } from '@/utils/format';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PopoverClose } from '@radix-ui/react-popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable"

import {
  ResizableHandleLayout,
  ResizablePanelLayout,
  ResizablePanelGroupLayou,
  ResizableSeparatorLayout,
} from "@/components/ui/resizable-layout"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import {
  AspectRatio,
} from "@/components/ui/aspect-ratio"

import {
  Progress,
} from "@/components/ui/progress"

import {
  ScrollArea,
} from "@/components/ui/scroll-area"

import {
  Skeleton,
} from "@/components/ui/skeleton"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Calendar,
} from "@/components/ui/calendar"

import {
  CommandDialog,
} from "@/components/ui/command-dialog"

import {
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu"

import {
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "@/components/ui/context-menu"

import {
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Slider,
} from "@/components/ui/slider"

import {
  Switch,
} from "@/components/ui/switch"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  useFormField,
} from "@/components/ui/form"

import {
  useDialog,
} from "@/components/ui/use-dialog"

import {
  useHoverCard,
} from "@/components/ui/use-hover-card"

import {
  useTransition,
} from "@/components/ui/use-transition"

import {
  useToastContext,
} from "@/components/ui/use-toast"

import {
  useTheme,
} from "@/components/ui/use-theme"

import {
  useSheet,
} from "@/components/ui/use-sheet"

import {
  useScrollArea,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContext,
} from "@/components/ui/resizable"

import {
  useCollapsible,
} from "@/components/ui/use-collapsible"

import {
  useCarousel,
} from "@/components/ui/use-carousel"

import {
  useCommandDialog,
} from "@/components/ui/use-command-dialog"

import {
  useContextMenu,
} from "@/components/ui/use-context-menu"

import {
  useAspectRatio,
} from "@/components/ui/use-aspect-ratio"

import {
  useProgress,
} from "@/components/ui/use-progress"

import {
  useSlider,
} from "@/components/ui/use-slider"

import {
  useSwitch,
} from "@/components/ui/use-switch"

import {
  useTooltip,
} from "@/components/ui/use-tooltip"

import {
  useDrawer,
} from "@/components/ui/use-drawer"

import {
  useCarouselContext,
} from "@/components/ui/use-carousel"

import {
  useCommandDialogContext,
} from "@/components/ui/use-command-dialog"

import {
  useContextMenuContext,
} from "@/components/ui/use-context-menu"

import {
  useSheetContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextLayout,
} from "@/components/ui/resizable-layout"

import {
  useResizablePanelContextLayout,
} from "@/components/ui/resizable-layout"

import {
  useResizableSeparatorContextLayout,
} from "@/components/ui/resizable-layout"

import {
  useCollapsibleContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card"

import {
  useTransitionContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-transition"

import {
  useToastContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-toast"

import {
  useThemeContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-theme"

import {
  useSheetContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-sheet"

import {
  useScrollAreaContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-scroll-area"

import {
  useResizablePanelGroupContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizablePanelContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useResizableSeparatorContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/resizable"

import {
  useCollapsibleContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-collapsible"

import {
  useHoverCardContextContextContextContextContextContextContextContextContextContextContext,
} from "@/components/ui/use-hover-card
