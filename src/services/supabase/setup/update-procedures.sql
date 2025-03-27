
-- Mettre à jour la fonction pour créer un rendez-vous
CREATE OR REPLACE FUNCTION public.create_appointment(appointment_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_appointment JSONB;
  inserted_id UUID;
BEGIN
  INSERT INTO public.appointments (
    title,
    description,
    date,
    duration,
    status,
    "freelancerid",
    "contactId",
    location,
    notes
  )
  VALUES (
    appointment_data->>'title',
    appointment_data->>'description',
    (appointment_data->>'date')::TIMESTAMP WITH TIME ZONE,
    (appointment_data->>'duration')::INTEGER,
    appointment_data->>'status',
    (appointment_data->>'freelancerid')::UUID,
    (appointment_data->>'contactId')::UUID,
    appointment_data->>'location',
    appointment_data->>'notes'
  )
  RETURNING id INTO inserted_id;
  
  -- Récupérer le rendez-vous créé
  SELECT row_to_json(a) INTO new_appointment
  FROM public.appointments a
  WHERE a.id = inserted_id;
  
  RETURN new_appointment;
END;
$function$;

-- Mettre à jour la fonction pour créer un rendez-vous auto-assigné
CREATE OR REPLACE FUNCTION public.create_auto_assign_appointment(appointment_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_appointment JSONB;
  inserted_id UUID;
  default_freelancer_id UUID;
BEGIN
  -- Récupérer l'ID d'un freelancer par défaut
  SELECT id INTO default_freelancer_id
  FROM public.users
  WHERE role = 'freelancer'
  LIMIT 1;
  
  -- Vérifier qu'un freelancer a été trouvé
  IF default_freelancer_id IS NULL THEN
    RAISE EXCEPTION 'Aucun freelancer disponible pour l''assignation par défaut';
  END IF;

  INSERT INTO public.appointments (
    title,
    description,
    date,
    duration,
    status,
    "freelancerid",
    "contactId",
    location,
    notes
  )
  VALUES (
    appointment_data->>'title',
    appointment_data->>'description',
    (appointment_data->>'date')::TIMESTAMP WITH TIME ZONE,
    (appointment_data->>'duration')::INTEGER,
    'pending',
    -- Utiliser le freelancer du paramètre si présent, sinon utiliser le freelancer par défaut
    COALESCE((appointment_data->>'freelancerid')::UUID, default_freelancer_id),
    (appointment_data->>'contactId')::UUID,
    appointment_data->>'location',
    appointment_data->>'notes'
  )
  RETURNING id INTO inserted_id;
  
  -- Récupérer le rendez-vous créé
  SELECT row_to_json(a) INTO new_appointment
  FROM public.appointments a
  WHERE a.id = inserted_id;
  
  RETURN new_appointment;
END;
$function$;

-- Mettre à jour la fonction pour accepter un rendez-vous
CREATE OR REPLACE FUNCTION public.accept_appointment(appointment_id uuid, freelancer_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  contact_id UUID;
BEGIN
  -- Récupérer l'ID du contact associé au rendez-vous
  SELECT "contactId" INTO contact_id
  FROM public.appointments
  WHERE id = appointment_id;
  
  -- Mettre à jour le rendez-vous
  UPDATE public.appointments
  SET 
    status = 'scheduled',
    "freelancerid" = freelancer_id
  WHERE id = appointment_id;
  
  -- Mettre à jour le contact
  UPDATE public.contacts
  SET 
    "assignedTo" = freelancer_id,
    status = 'prospect'
  WHERE id = contact_id;
END;
$function$;
