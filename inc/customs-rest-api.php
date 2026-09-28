<?php 
// =========================================================================
// ============================= API REST ==================================
// =========================================================================

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/translations', [
        'methods' => 'GET',
        'callback' => function ($request) {
            $lang = $request->get_param('lang');
            return generate_translated_json($lang);
        },
        'args' => [
            'lang' => [
                'required' => true,
                'validate_callback' => function ($param) {
                    // Vérifie que la langue existe dans la liste des langues Polylang
                    return in_array($param, pll_languages_list());
                }
            ],
        ],
    ]);
});

function get_translations_json($data)
{
    $lang = $data['lang'];
    return new WP_REST_Response(json_decode(generate_translated_json($lang)), 200);
}

function generate_translated_json($lang)
{
    // Définir la langue active dans Polylang
    if (!function_exists('pll__')) {
        return json_encode(['error' => 'Polylang non chargé'], JSON_UNESCAPED_UNICODE);
    }
    // 1. On récupère les traductions dynamiques d'ACF pour la langue demandée
    $option_id = $lang ? 'options_' . $lang : 'option';
    $dynamic_options = [];
    if (function_exists('have_rows') && have_rows('project_options', $option_id)) {
        $i = 0;
        while (have_rows('project_options', $option_id)) {
            the_row();
            $dynamic_options["dynamic_{$i}"] = [
                'label' => get_sub_field('label_text'),
                'cta'   => get_sub_field('cta_text')
            ];
            $i++;
        }
    }

    // Générer le JSON avec les traductions pour la langue spécifiée
    $json = [
        'translation' => [
            'dashboard' => [
                'greeting' => pll__('Bonjour {{firstName}}', 'membership'),
                'orders' => [
                    'title' => pll__('Vos dernières commandes', 'membership'),
                    'viewAll' => pll__('Voir toutes mes commandes', 'membership'),
                    'actions' => [
                        'details' => pll__('Détails', 'membership')
                    ]
                ],
                'projects' => [
                    'title' => pll__('Vos projets en cours', 'membership'),
                    'viewAll' => pll__('Voir tous mes projets', 'membership'),
                    'actions' => [
                        'edit' => pll__('Editer en ligne', 'membership')
                    ]
                ]
            ],
            'orders' => [
                'title' => pll__('Vos commandes', 'membership'),
                'id' => pll__('Commande id #{{id}}', 'membership'),
                'date' => pll__('{{date}}', 'membership'),
                'empty' => [
                    'title' => pll__('Aucune commande pour le moment', 'membership'),
                    'description' => pll__('Vous n\'avez pas encore passé de commande. Commencez par créer un projet !', 'membership'),
                    'cta' => pll__('Créer un projet', 'membership')
                ],
                'actions' => [
                    'addProductSuccess' => pll__('Produit ajouté au panier', 'membership'),
                    'addProductError' => pll__('Une erreur est survenue lors de l\'ajout du produit au panier', 'membership')
                ],
                'item' => [
                    'title' => pll__('Votre commande', 'membership'),
                    'product' => [
                        'title' => pll__('Produit commandé', 'membership')
                    ],
                    'total' => [
                        'title' => pll__('Total', 'membership'),
                        'count_one' => pll__('1 produit', 'membership'),
                        'count_other' => pll__('{{count}} produits', 'membership'),
                        'count' => pll__('{{count}} produit(s)', 'membership')
                    ],
                    'shipping' => [
                        'title' => pll__('Livraison', 'membership'),
                        'total' => pll__('Total', 'membership')
                    ],
                    'payment' => [
                        'title' => pll__('Moyen de paiement sélectionné', 'membership')
                    ],
                    'history' => [
                        'title' => pll__('Historique / Statut de la commande', 'membership')
                    ],
                    'actions' => [
                        'addProductSuccess' => pll__('Produit ajouté au panier', 'membership'),
                        'success' => pll__('Produit ajouté au panier', 'membership'),
                        'error' => pll__('Erreur lors de l\'ajout au panier', 'membership'),
                        'invoice' => pll__('Télécharger la facture', 'membership'),
                        'reorder' => pll__('Recommander', 'membership'),
                        'share' => pll__('Aperçu', 'membership')
                    ],
                    'status' => [
                        'title' => pll__('Statut de la commande', 'membership'),
                        'pending' => pll__('En attente', 'membership'),
                        'shipping' => pll__('Statut de livraison', 'membership')
                    ]
                ]
            ],
            'projects' => [
                'title' => pll__('Vos projets en cours', 'membership'),
                'modifiedAt' => pll__('Modifié le {{date}}', 'membership'),
                'status' => [
                    'deleteSuccess' => pll__('Produit supprimé', 'membership')
                ],
                'empty' => [
                    'title' => pll__('Aucun projet en cours', 'membership'),
                    'description' => pll__('Vous n\'avez pas encore de projets. Démarrez votre première création !', 'membership'),
                    'cta' => pll__('Créer un projet', 'membership')
                ],
                'modal' => [
                    'title' => pll__('Commencer un nouveau projet', 'membership'),
                    'description' => pll__('Créez un nouveau projet pour commencer', 'membership')
                ],
                'createModal' => array_merge(
                    [
                        'title' => pll__('Créer un nouveau projet', 'membership'),
                        'option1' => [
                            'label' => pll__('Créer un album ou un calendrier', 'membership'),
                            'cta' => pll__('Commencer à créer', 'membership')
                        ],
                        'option2' => [
                            'label' => pll__('Commander un tirage photo', 'membership'),
                            'cta' => pll__('Voir les produits', 'membership')
                        ]
                    ],
                    $dynamic_options
                ),
                'deleteModal' => [
                    'cancel' => pll__('Annuler', 'membership'),
                    'confirm' => pll__('Supprimer', 'membership'),
                    'description' => pll__('Voulez-vous vraiment supprimer le projet « {{name}} » ? Cette action est définitive.', 'membership'),
                    'title' => pll__('Supprimer le projet', 'membership')
                ]
            ],
            'promo' => [
                'title' => pll__('Mes avantages', 'membership'),
                'codes' => [
                    'title' => pll__('Vos codes promo disponible', 'membership'),
                    'description' => pll__('{{amount}}€ restant - Expire le {{date}}', 'membership'),
                    'empty' => pll__('Vous n\'avez aucun code promo disponible pour le moment.', 'membership')
                ],
                'credits' => [
                    'title' => pll__('Vos crédits disponible', 'membership')
                ],
                'points' => [
                    'title' => pll__('Vos points TicTacPhoto', 'membership'),
                    'description' => pll__('Profitez de vos points lors de votre prochaine commande pour bénéficier de réductions avantageuses.', 'membership'),
                    'reward' => pll__('Réduction points TicTacPhoto', 'membership'),
                    'convert' => pll__('correspond à {{value}}€', 'membership'),
                    'action' => [
                        'convert' => pll__('Convertir vos points en code promo', 'membership')
                    ],
                    'form' => [
                        'title' => pll__('Combien de points voulez-vous convertir ?', 'membership'),
                        'submit' => pll__('Convertir en code promo', 'membership'),
                        'success' => pll__('Code promo créé avec succès', 'membership'),
                        'error' => pll__('Une erreur est survenue lors de la conversion de vos points', 'membership')
                    ]
                ]
            ],
            'cart' => [
                'title' => pll__('Votre panier', 'membership'),
                'summary' => [
                    'title' => pll__('Résumé de votre commande', 'membership'),
                    'total' => pll__('Total', 'membership'),
                    'shipping' => pll__('Livraison', 'membership'),
                    'fees' => pll__('Calculé à la prochaine étape', 'membership'),
                    'checkout' => pll__('Passer votre commande', 'membership')
                ],
                'empty' => [
                    'title' => pll__('Votre panier est vide !', 'membership'),
                    'description' => pll__('Commencez à créer un projet ou ajouter des produits à votre panier.', 'membership'),
                    'createProject' => pll__('Créer votre projet', 'membership')
                ]
            ],
            'checkout' => [
                'title' => pll__('Procéder au paiement', 'membership'),
                'actions' => [
                    'back' => pll__('Retour au panier', 'membership'),
                    'next' => pll__('Etape suivante', 'membership'),
                    'submit' => pll__('Procéder au paiement', 'membership')
                ],
                'steps' => [
                    'address' => pll__('Vos coordonnées', 'membership'),
                    'shipping' => pll__('Livraison', 'membership'),
                    'promo' => pll__('Réduction et code promo', 'membership'),
                    'payment' => pll__('Méthode de paiement', 'membership'),
                    'label' => pll__('étape {{id}}', 'membership')
                ],
                'address' => [
                    'title' => pll__('Vos adresses et coordonnées', 'membership'),
                    'edit' => pll__('Modifier', 'membership'),
                    'empty' => [
                        'title' => pll__('Aucune adresse enregistrée', 'membership'),
                        'description' => pll__('Ajoutez une adresse de livraison pour pouvoir passer votre commande.', 'membership'),
                        'cta' => pll__('Ajouter une adresse', 'membership')
                    ]
                ],
                'summary' => [
                    'title' => pll__('Résumé de votre commande', 'membership'),
                    'removeLogo' => pll__('Retirer la page avec le logo TicTacPhoto (+ 2,50 €)', 'membership'),
                    'group' => [
                        'title' => pll__('Livraison n°{{index}}', 'membership')
                    ],
                    'promo' => [
                        'title' => pll__('Codes promo appliqués', 'membership'),
                        'discount' => pll__('Réduction', 'membership')
                    ],
                    'shipping' => [
                        'title' => pll__('Livraison', 'membership'),
                        'estimate_one' => pll__('{{count}} jour', 'membership'),
                        'estimate_other' => pll__('{{count}} jours', 'membership'),
                        'price_zero' => pll__('Gratuit', 'membership'),
                        'price_other' => pll__('+ {{count}} €', 'membership')
                    ],
                    'total' => pll__('Total', 'membership')
                ],
                'shipping' => [
                    'title' => pll__('Choix de livraison', 'membership'),
                    'group' => [
                        'title' => pll__('Mode de livraison', 'membership')
                    ]
                ],
                'mondialRelay' => [
                    'title' => pll__('Points relais disponibles', 'membership'),
                    'dialogTitle' => pll__('Choisir un point relais Mondial Relay', 'membership'),
                    'confirm' => pll__('Confirmer ce point relais', 'membership')
                ],
                'promo' => [
                    'title' => pll__('Appliquer un code promo ?', 'membership'),
                    'form' => [
                        'title' => pll__('Ajouter un code promo', 'membership'),
                        'placeholder' => pll__('ex : Promo2024', 'membership'),
                        'submit' => pll__('Appliquer un code promo', 'membership')
                    ],
                    'points' => [
                        'title' => pll__('Vos points club', 'membership')
                    ],
                    'credits' => [
                        'title' => pll__('Vos crédits disponibles', 'membership')
                    ],
                    'applied' => pll__('Code promo appliqué:', 'membership'),
                    'remove' => pll__('Retirer', 'membership'),
                    'removed' => pll__('Code promo retiré', 'membership'),
                    'already_applied' => pll__('Ce code promo est déjà appliqué', 'membership'),
                    'success' => pll__('Code promo appliqué avec succès', 'membership'),
                    'error' => pll__('Erreur lors de l\'application du code promo', 'membership')
                ],
                'payment' => [
                    'title' => pll__('Choix de paiement', 'membership'),
                    'form' => [
                        'title' => pll__('Mode de paiement', 'membership'),
                        'online' => pll__('Paiement sécurisé en ligne', 'membership'),
                        'offline' => pll__('Virement bancaire', 'membership'),
                        'total' => pll__('Total', 'membership'),
                        'accept' => pll__('J\'accepte les conditions générales de vente et d\'utilisation', 'membership'),
                        'submit' => pll__('Passer votre commande', 'membership')
                    ],
                    'failed' => pll__('Votre paiement n\'a pas abouti. Vous pouvez réessayer ou contacter le support.', 'membership'),
                    'succeeded' => pll__('Votre paiement a bien été reçu. Merci pour votre commande !', 'membership')
                ],
                'offline' => [
                    'title' => pll__('Paiement par virement bancaire', 'membership'),
                    'bank' => [
                        'title' => pll__('Coordonnées bancaires', 'membership'),
                        'amount' => pll__('Montant', 'membership'),
                        'bic' => pll__('BIC', 'membership'),
                        'iban' => pll__('IBAN', 'membership'),
                        'holder' => pll__('Titulaire du compte', 'membership'),
                        'communication' => pll__('Communication', 'membership')
                    ],
                    'important' => [
                        'title' => pll__('Informations importantes', 'membership'),
                        'communication' => pll__('N\'oubliez pas d\'indiquer la communication lors de votre virement', 'membership'),
                        'confirmation' => pll__('Vous recevrez une confirmation par email une fois le paiement reçu', 'membership'),
                        'processing' => pll__('Le traitement peut prendre 2-3 jours ouvrables', 'membership')
                    ],
                    'instructions' => [
                        'title' => pll__('Instructions de paiement', 'membership'),
                        'description' => pll__('Effectuez un virement bancaire avec les informations ci-dessous', 'membership')
                    ],
                    'order' => [
                        'number' => pll__('Numéro de commande', 'membership')
                    ],
                    'qr' => [
                        'title' => pll__('Code QR de paiement', 'membership'),
                        'description' => pll__('Scannez ce code avec l\'application de votre banque pour préremplir automatiquement le virement.', 'membership')
                    ]
                ]
            ],
            'invoice' => [
                'title' => pll__('Demander une facture', 'membership'),
                'form' => [
                    'address1' => [
                        'label' => pll__('Adresse', 'membership'),
                        'placeholder' => pll__('Rue et numéro', 'membership')
                    ],
                    'address2' => [
                        'label' => pll__('Complément d\'adresse', 'membership'),
                        'placeholder' => pll__('Boîte, étage, bâtiment', 'membership')
                    ],
                    'city' => [
                        'label' => pll__('Ville', 'membership'),
                        'placeholder' => pll__('Votre ville', 'membership')
                    ],
                    'company' => [
                        'label' => pll__('Société', 'membership'),
                        'placeholder' => pll__('Nom de la société', 'membership')
                    ],
                    'country' => [
                        'label' => pll__('Pays', 'membership')
                    ],
                    'error' => pll__('Impossible d\'envoyer votre demande de facture', 'membership'),
                    'firstName' => [
                        'label' => pll__('Prénom', 'membership'),
                        'placeholder' => pll__('Votre prénom', 'membership')
                    ],
                    'lastName' => [
                        'label' => pll__('Nom', 'membership'),
                        'placeholder' => pll__('Votre nom', 'membership')
                    ],
                    'legalForm' => [
                        'label' => pll__('Forme juridique', 'membership'),
                        'placeholder' => pll__('Ex : SPRL, SA, SRL', 'membership')
                    ],
                    'phone' => [
                        'label' => pll__('Téléphone', 'membership'),
                        'placeholder' => pll__('Votre numéro de téléphone', 'membership')
                    ],
                    'postal' => [
                        'label' => pll__('Code postal', 'membership'),
                        'placeholder' => pll__('Ex : 1070', 'membership')
                    ],
                    'status' => [
                        'required' => pll__('Ce champ est obligatoire', 'membership'),
                        'vatnum' => pll__('Le numéro de TVA doit commencer par deux lettres majuscules suivies de chiffres (ex : BE0123456789)', 'membership')
                    ],
                    'submit' => pll__('Demander une facture', 'membership'),
                    'success' => pll__('Votre demande de facture a bien été envoyée', 'membership'),
                    'vatnum' => [
                        'label' => pll__('Numéro de TVA', 'membership'),
                        'placeholder' => pll__('Ex : BE0123456789', 'membership')
                    ]
                ]
            ],
            'address' => [
                'edit_add' => pll__('Ajouter une adresse', 'membership'),
                'edit_edit' => pll__('Modifier une adresse', 'membership'),
                'delete' => [
                    'title' => pll__('Supprimer l\'adresse', 'membership'),
                    'confirm' => pll__('Oui, supprimer', 'membership'),
                    'cancel' => pll__('Annuler', 'membership'),
                    'success' => pll__('Adresse supprimée avec succès', 'membership'),
                    'error' => pll__('Erreur lors de la suppression', 'membership')
                ],
                'form' => [
                    'alias' => [
                        'label' => pll__('Nom / identifiant de votre adresse', 'membership'),
                        'placeholder' => pll__('Ex : Maison grands-parents', 'membership')
                    ],
                    'lastName' => [
                        'label' => pll__('Nom *', 'membership'),
                        'placeholder' => pll__('Doe', 'membership')
                    ],
                    'firstName' => [
                        'label' => pll__('Prénom *', 'membership'),
                        'placeholder' => pll__('John', 'membership')
                    ],
                    'phone' => [
                        'label' => pll__('Téléphone *', 'membership'),
                        'placeholder' => pll__('06 00 00 00 00', 'membership')
                    ],
                    'address1' => [
                        'label' => pll__('Rue *', 'membership'),
                        'placeholder' => pll__('Rue des jonquilles', 'membership')
                    ],
                    'address2' => [
                        'label' => pll__('Ligne 2', 'membership'),
                        'placeholder' => pll__('Information supplémentaire de l\'adresse', 'membership')
                    ],
                    'streetNumber' => [
                        'label' => pll__('N° *', 'membership'),
                        'placeholder' => pll__('10', 'membership')
                    ],
                    'boxNumber' => [
                        'label' => pll__('N° de boite', 'membership'),
                        'placeholder' => pll__('B1', 'membership')
                    ],
                    'city' => [
                        'label' => pll__('Localité *', 'membership'),
                        'placeholder' => pll__('Bruxelles', 'membership')
                    ],
                    'postal' => [
                        'label' => pll__('Code postal *', 'membership'),
                        'placeholder' => pll__('1000', 'membership')
                    ],
                    'country' => [
                        'label' => pll__('Pays *', 'membership'),
                        'placeholder' => pll__('Sélectionnez un pays', 'membership')
                    ],
                    'defaultHint' => pll__('(le votre par défaut)', 'membership'),
                    'submit_create' => pll__('Créer', 'membership'),
                    'submit_update' => pll__('Modifier', 'membership'),
                    'created' => pll__('Adresse ajoutée', 'membership'),
                    'error' => pll__('Impossible d\'enregistrer l\'adresse', 'membership'),
                    'updated' => pll__('Adresse modifiée', 'membership')
                ]
            ],
            'profile' => [
                'title' => pll__('Editer votre profil', 'membership'),
                'account' => [
                    'passwordUpdateSuccess' => pll__('Votre mot de passe a été mis à jour avec succès', 'membership'),
                    'updateSuccess' => pll__('Votre profil a été mis à jour avec succès', 'membership')
                ],
                'shipping' => [
                    'title' => pll__('Vos données de livraison', 'membership'),
                    'action' => [
                        'edit' => pll__('Modifier mes addresses', 'membership')
                    ]
                ],
                'subtitle' => pll__('Mes informations personnelles', 'membership'),
                'form' => [
                    'status' => [
                        'required' => pll__('Ce champ est requis', 'membership'),
                        'notMatch' => pll__('Les mots de passe ne correspondent pas', 'membership'),
                        'terms' => pll__('Vous devez accepter les conditions d\'utilisation', 'membership'),
                        'minLength' => pll__('Le mot de passe doit contenir au moins 8 caractères', 'membership'),
                        'uppercase' => pll__('Le mot de passe doit contenir au moins une majuscule', 'membership')
                    ],
                    'action' => [
                        'submit_create' => pll__('Je crée mon compte', 'membership'),
                        'submit_update' => pll__('Je modifie mes informations', 'membership')
                    ],
                    'title' => [
                        'label' => pll__('Titre', 'membership'),
                        'options' => [
                            'mr' => pll__('Mr', 'membership'),
                            'ms' => pll__('Ms', 'membership'),
                            'other' => pll__('Other', 'membership')
                        ]
                    ],
                    'lastName' => [
                        'label' => pll__('Nom', 'membership'),
                        'placeholder' => pll__('Votre nom', 'membership')
                    ],
                    'firstName' => [
                        'label' => pll__('Prénom', 'membership'),
                        'placeholder' => pll__('Votre prénom', 'membership')
                    ],
                    'phone' => [
                        'label' => pll__('Téléphone', 'membership'),
                        'placeholder' => pll__('Votre numéro de téléphone', 'membership')
                    ],
                    'email' => [
                        'label' => pll__('Email', 'membership'),
                        'placeholder' => pll__('Votre email', 'membership')
                    ],
                    'password' => [
                        'label' => pll__('Mot de passe', 'membership'),
                        'placeholder' => pll__('Définissez votre mot de passe', 'membership'),
                        'extra' => pll__('Le mot de passe doit contenir au minimum 8 caractères, dont au moins une majuscule.', 'membership'),
                        'change' => pll__('Changer le mot de passe', 'membership')
                    ],
                    'confirm' => [
                        'label' => pll__('Confirmer le mot de passe', 'membership'),
                        'placeholder' => pll__('Confirmer votre mot de passe', 'membership')
                    ],
                    'terms' => [
                        'label' => pll__('J\'accepte que ce site traite mes données personnelles selon la politique de confidentialité.', 'membership')
                    ],
                    'newsletter' => [
                        'label' => pll__('Je m\'inscris aux newsletters et autres news de TicTacPhoto.', 'membership')
                    ]
                ],
                'address' => [
                    'title' => pll__('Vos adresses', 'membership'),
                    'subtitle' => pll__('Vos adresses de livraison', 'membership'),
                    'action' => [
                        'add' => pll__('Ajouter une adresse', 'membership')
                    ]
                ]
            ],
            'global' => [
                'navigation' => [
                    'back' => pll__('Retour', 'membership'),
                    'logout' => pll__('Se déconnecter', 'membership'),
                    'closeMenu' => pll__('Fermer le menu', 'membership'),
                    'logoutSuccess' => pll__('Vous avez été déconnecté', 'membership'),
                    'toggleMenu' => pll__('Basculer le menu', 'membership')
                ],
                'sidebar' => [
                    'dashboard' => pll__('Tableau de bord', 'membership'),
                    'orders' => pll__('Mes commandes', 'membership'),
                    'projects' => pll__('Mes projets en cours', 'membership'),
                    'promo' => pll__('Mes codes promo', 'membership'),
                    'createProject' => pll__('Créer votre projet', 'membership'),
                    'cart' => pll__('Voir mon panier', 'membership'),
                    'support' => pll__('Support et ticket', 'membership')
                ],
                'account' => [
                    'title' => pll__('Mon compte', 'membership'),
                    'subtitle' => pll__('Paramètres de votre compte', 'membership')
                ],
                'addresses' => [
                    'title' => pll__('Mes adresses', 'membership'),
                    'subtitle' => pll__('Vos adresses de livraison', 'membership')
                ]
            ],
            'login' => [
                'title' => pll__('Connectez-vous à votre compte TicTacPhoto', 'membership'),
                'status' => [
                    'error' => pll__('Une erreur est survenue, veuillez réessayer', 'membership'),
                    'invalidCredentials' => pll__('Identifiants incorrects', 'membership')
                ],
                'form' => [
                    'email' => [
                        'label' => pll__('E-mail', 'membership'),
                        'placeholder' => pll__('Votre adresse e-mail', 'membership')
                    ],
                    'password' => [
                        'label' => pll__('Mot de passe', 'membership'),
                        'placeholder' => pll__('********', 'membership')
                    ],
                    'submit' => pll__('Je me connecte', 'membership')
                ],
                'actions' => [
                    'forgot' => pll__('Mot de passe oublié ?', 'membership'),
                    'register' => pll__('Pas encore de compte TicTacPhoto ?', 'membership')
                ]
            ],
            'recovery' => [
                'title' => pll__('Mot de passe oublié ?', 'membership'),
                'subtitle' => pll__('Demander un nouveau mot de passe', 'membership'),
                'form' => [
                    'email' => [
                        'label' => pll__('E-mail', 'membership'),
                        'placeholder' => pll__('Votre adresse e-mail', 'membership')
                    ],
                    'submit' => pll__('Réinitialiser mon mot de passe', 'membership')
                ],
                'status' => [
                    'success' => pll__('Un email de récupération vous a été envoyé', 'membership')
                ],
                'actions' => [
                    'back' => pll__('Retour à la page de connexion', 'membership')
                ]
            ],
            'register' => [
                'title' => pll__('Créez votre compte sur TicTacPhoto', 'membership'),
                'status' => [
                    'error' => pll__('Une erreur est survenue lors de la création du compte', 'membership'),
                    'success' => pll__('Votre compte a été créé avec succès', 'membership')
                ]
            ],
            'reset' => [
                'title' => pll__('Définir un nouveau mot de passe pour votre compte', 'membership'),
                'status' => [
                    'error' => pll__('Une erreur est survenue', 'membership'),
                    'success' => pll__('Mot de passe changé avec succès', 'membership')
                ],
                'form' => [
                    'email' => [
                        'label' => pll__('E-mail', 'membership'),
                        'placeholder' => pll__('Votre adresse e-mail', 'membership')
                    ],
                    'password' => [
                        'label' => pll__('Nouveau mot de passe', 'membership'),
                        'placeholder' => pll__('Définissez votre nouveau mot de passe', 'membership'),
                        'extra' => pll__('Le mot de passe doit contenir au minimum 8 caractères, dont au moins une majuscule.', 'membership')
                    ],
                    'confirm' => [
                        'label' => pll__('Confirmation mot de passe', 'membership'),
                        'placeholder' => pll__('Confirmez votre nouveau mot de passe', 'membership')
                    ],
                    'submit' => pll__('Changer de mot de passe', 'membership')
                ]
            ],
            'setPassword' => [
                'title' => pll__('Définissez votre mot de passe', 'membership'),
                'description' => pll__('Votre compte a été créé automatiquement lors d\'une commande passée pour vous. Choisissez un mot de passe pour sécuriser votre compte avant de continuer.', 'membership'),
                'success' => pll__('Mot de passe défini avec succès', 'membership'),
                'error' => pll__('Une erreur est survenue, veuillez réessayer', 'membership')
            ],
            'errors' => [
                'title' => pll__('Une erreur est survenue', 'membership'),
                'description' => pll__('Impossible de charger ces données pour le moment. Veuillez réessayer.', 'membership'),
                'unexpectedResponse' => pll__('Les données reçues sont inattendues. Nos équipes ont été informées.', 'membership'),
                'retry' => pll__('Réessayer', 'membership'),
                'backToDashboard' => pll__('Retour au tableau de bord', 'membership')
            ],
            'common' => [
                'loadMore' => pll__('Charger plus', 'membership'),
                'loading' => pll__('Chargement...', 'membership')
            ]
        ]
    ];

    return rest_ensure_response($json);
}